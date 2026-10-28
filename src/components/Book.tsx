import {
  createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
  type PointerEvent, type ReactNode, type TouchEvent,
} from "react";
import { content } from "../content/content";
import { CHAPTERS, chapter, type ChapterId } from "../lib/chapters";
import { T, cx } from "../lib/text";
import { prefersReducedMotion } from "../lib/utils";
import { Icon } from "./ui";

export interface BookPage {
  key: string;
  content: ReactNode;
  /** Chapter this page belongs to (drives the running head and the edge tabs). */
  chapter?: ChapterId;
  /** Title pages and chapter openers skip the running head. */
  plain?: boolean;
  className?: string;
}

type Side = "left" | "right" | "single";
type Motion = "out-fwd" | "in-fwd" | "out-back" | "in-back";
/** A still page under a turning one: the lifting leaf's shadow slides off it, or falls onto it. */
type Under = "reveal" | "cover";
type Turn = { from: number[]; to: number[]; dir: 1 | -1; start: number };
type Phase = "closed" | "opening" | "open";

const TURN_MS = 900;
/**
 * The page size everything was laid out for (a big phone). A smaller page shows the same
 * layout scaled down as a whole, the way a pocket edition shrinks a book; bigger pages don't scale up.
 */
const DESIGN_PAGE = { w: 400, h: 606 };
const OPEN_MS = 1500;
/** Wide, landscape screens get an open two-page spread; everything else reads one page at a time. */
const SPREAD_QUERY = "(min-width: 900px) and (min-aspect-ratio: 11/10)";

function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatch(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return match;
}

const BookContext = createContext<{ goTo: (page: number) => void; pageOf: (id: ChapterId) => number }>({
  goTo: () => {},
  pageOf: () => 0,
});
export const useBook = () => useContext(BookContext);

/**
 * The scrapbook itself. It starts closed; its cover swings open on the spine, then pages turn
 * one at a time (phones) or as open spreads (wide screens) by tapping a page's outer edge, a swipe,
 * or the arrow keys.
 */
export function Book({ pages, initialChapter, cover, onOpened, onChapter }: {
  pages: BookPage[];
  initialChapter?: ChapterId;
  /** The front of the cover; call `open` to swing it open. */
  cover: (open: () => void) => ReactNode;
  onOpened?: () => void;
  /** Called with the chapter now in view (undefined for the contents and dedication). */
  onChapter?: (id: ChapterId | undefined) => void;
}) {
  const spread = useMediaQuery(SPREAD_QUERY);
  const last = pages.length - 1;
  const pageOf = useCallback((id: ChapterId) => Math.max(0, pages.findIndex((p) => p.chapter === id)), [pages]);

  const [phase, setPhase] = useState<Phase>("closed");
  const [at, setAt] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const isOpen = phase === "open";

  // On a spread, the left page is odd-numbered behind the scenes: spread 0 is [endpaper, contents].
  const viewOf = useCallback((i: number): number[] => {
    if (!spread) return [i];
    const s = Math.floor((i + 1) / 2);
    return [2 * s - 1, 2 * s];
  }, [spread]);

  const view = viewOf(at);
  const canPrev = view[0] > 0;
  const canNext = view[view.length - 1] < last;

  const open = useCallback(() => {
    if (phase !== "closed") return;
    if (prefersReducedMotion()) { setPhase("open"); return; }
    setPhase("opening");
    timer.current = window.setTimeout(() => setPhase("open"), OPEN_MS);
  }, [phase]);

  const goTo = useCallback((target: number) => {
    if (!isOpen) return;
    // A tap while a page is still lifting is ignored; once it's past halfway, the next turn may start.
    if (turn && performance.now() - turn.start < TURN_MS * 0.5) return;
    const to = Math.min(Math.max(target, 0), last);
    const fromView = viewOf(at);
    const toView = viewOf(to);
    setAt(to);
    if (fromView[0] === toView[0]) return;
    window.clearTimeout(timer.current);
    if (prefersReducedMotion()) { setTurn(null); return; }
    setTurn({ from: fromView, to: toView, dir: toView[0] > fromView[0] ? 1 : -1, start: performance.now() });
    timer.current = window.setTimeout(() => setTurn(null), TURN_MS);
  }, [at, isOpen, last, turn, viewOf]);

  const next = useCallback(() => goTo(viewOf(at).at(-1)! + 1), [at, goTo, viewOf]);
  const prev = useCallback(() => goTo(viewOf(at)[0] - 1), [at, goTo, viewOf]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const pageW = spread ? stage.clientWidth / 2 : stage.clientWidth;
      setScale(Math.min(1, pageW / DESIGN_PAGE.w, stage.clientHeight / DESIGN_PAGE.h));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [spread]);
  useEffect(() => { if (isOpen) { window.clearTimeout(timer.current); setTurn(null); } }, [spread, isOpen]);

  // Once the cover is open: keep keyboard focus in the book, and honour a link like …/#letters.
  const arrived = useRef(false);
  useEffect(() => {
    if (!isOpen || arrived.current) return;
    arrived.current = true;
    onOpened?.();
    stageRef.current?.focus({ preventScroll: true });
    if (initialChapter) goTo(pageOf(initialChapter));
  }, [isOpen, onOpened, initialChapter, goTo, pageOf]);
  useEffect(() => {
    if (isOpen && !turn && document.activeElement === document.body) stageRef.current?.focus({ preventScroll: true });
  }, [isOpen, turn]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (document.querySelector("dialog[open]")) return;
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, select, [contenteditable]")) return;
      const actions: Record<string, () => void> = {
        ArrowRight: next, PageDown: next, ArrowLeft: prev, PageUp: prev,
        Home: () => goTo(0), End: () => goTo(last),
      };
      const action = actions[e.key];
      if (action) { e.preventDefault(); action(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, last]);

  const onTouchStart = (e: TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e: TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) (dx < 0 ? next : prev)();
  };
  // With a mouse, dragging the page sideways turns it too.
  const drag = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: PointerEvent) => { if (e.pointerType === "mouse") drag.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) (dx < 0 ? next : prev)();
  };

  // Which pages are on the desk right now, and which of them are mid-flip.
  type Slot = { index: number; side: Side; motion?: Motion; under?: Under };
  let slots: Slot[];
  if (!isOpen) {
    // Closed or opening: only what lies under the front cover (its inside is the left endpaper).
    slots = view.filter((i) => i >= 0).map((index) => ({
      index, side: spread ? "right" : "single", under: phase === "opening" ? "reveal" : undefined,
    }));
  } else if (!turn) {
    slots = view.map((index, k) => ({ index, side: spread ? (k ? "right" : "left") : "single" }));
  } else if (!spread) {
    slots = turn.dir > 0
      ? [{ index: turn.to[0], side: "single", under: "reveal" }, { index: turn.from[0], side: "single", motion: "out-fwd" }]
      : [{ index: turn.from[0], side: "single", under: "cover" }, { index: turn.to[0], side: "single", motion: "in-back" }];
  } else {
    const [fl, fr] = turn.from;
    const [tl, tr] = turn.to;
    slots = turn.dir > 0
      ? [{ index: fl, side: "left", under: "cover" }, { index: tr, side: "right", under: "reveal" },
         { index: fr, side: "right", motion: "out-fwd" }, { index: tl, side: "left", motion: "in-fwd" }]
      : [{ index: tl, side: "left", under: "reveal" }, { index: fr, side: "right", under: "cover" },
         { index: fl, side: "left", motion: "out-back" }, { index: tr, side: "right", motion: "in-back" }];
  }

  const shown = view.filter((i) => i >= 0 && i <= last).map((i) => i + 1);
  const where = shown.length > 1 ? `Pages ${shown[0]}–${shown[1]}` : `Page ${shown[0]}`;
  const current = pages[view.find((i) => i >= 0 && i <= last) ?? 0]?.chapter;
  const ctx = useMemo(() => ({ goTo, pageOf }), [goTo, pageOf]);
  useEffect(() => { if (isOpen) onChapter?.(current); }, [isOpen, current, onChapter]);

  return (
    <BookContext.Provider value={ctx}>
      <div
        className={cx("book", spread ? "is-spread" : "is-single", `is-${phase}`)}
        style={{ ["--turn" as string]: `${TURN_MS}ms`, ["--open" as string]: `${OPEN_MS}ms`, ["--page-scale" as string]: scale }}
      >
        <div
          ref={stageRef}
          className="book__stage"
          role="region"
          aria-roledescription="book"
          aria-label="Our Little Universe"
          tabIndex={-1}
          onTouchStart={isOpen ? onTouchStart : undefined}
          onTouchEnd={isOpen ? onTouchEnd : undefined}
          onPointerDown={isOpen ? onPointerDown : undefined}
          onPointerUp={isOpen ? onPointerUp : undefined}
        >
          {slots.map(({ index, side, motion, under }) => (
            <Leaf key={index} page={pages[index]} index={index} side={side} motion={motion} under={under} hidden={!isOpen} />
          ))}

          {!isOpen && (
            <div className="cover-leaf" inert={phase === "opening"}>
              <div className="cover-leaf__front">{cover(open)}</div>
              <div className="cover-leaf__back" aria-hidden="true"><span className="cover-leaf__endpaper" /></div>
            </div>
          )}

          {isOpen && (
            <>
              {spread && (
                <nav className="tabs" aria-label="Chapters">
                  {CHAPTERS.map((c, i) => (
                    <button key={c.id} className={cx("tab", `tab--${i % 4}`)} type="button"
                      aria-current={current === c.id ? "true" : undefined} onClick={() => goTo(pageOf(c.id))}>
                      {c.tab}
                    </button>
                  ))}
                </nav>
              )}

              {/* invisible strips along the outer edges: tap the edge of a page to turn it */}
              <button className="edge edge--prev" type="button" aria-label="Turn back a page" disabled={!canPrev} onClick={prev} />
              <button className="edge edge--next" type="button" aria-label="Turn the page" disabled={!canNext} onClick={next} />
            </>
          )}
        </div>
        <p className="visually-hidden" aria-live="polite">{isOpen ? `${where} of ${pages.length}` : ""}</p>
        <div className="rotate-hint" aria-hidden="true">
          <span className="rotate-hint__phone" />
          <p>This little book reads best upright.<br />Turn your phone around ♡</p>
        </div>
      </div>
    </BookContext.Provider>
  );
}

function Leaf({ page, index, side, motion, under, hidden }: {
  page?: BookPage; index: number; side: Side; motion?: Motion; under?: Under; hidden?: boolean;
}) {
  // Past either end of a spread there's only the patterned endpaper inside the cover.
  if (!page) {
    return <div className={cx("page", `page--${side}`, "page--endpaper")} data-motion={motion} data-under={under} aria-hidden="true" />;
  }

  const head = !page.plain && page.chapter ? chapter(page.chapter).title : null;
  return (
    <section
      className={cx("page", `page--${side}`, page.className)}
      data-motion={motion}
      data-under={under}
      aria-label={`Page ${index + 1}`}
      aria-hidden={hidden || undefined}
      inert={hidden || motion === "out-fwd" || motion === "out-back"}
    >
      {head && <p className="page__head" aria-hidden="true">{head}</p>}
      <div className="page__inner">{page.content}</div>
      <p className="page__num" aria-hidden="true">{index + 1}</p>
    </section>
  );
}

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"];

/** The dedication, alone on its page the way books do it. */
export function Dedication() {
  return (
    <div className="dedication">
      <Icon name="heart" className="dedication__heart" />
      <T as="p" className="dedication__text" value={content.cover.dedication} />
    </div>
  );
}

/** Page one: the title page and table of contents. */
export function Contents() {
  const { goTo, pageOf } = useBook();
  const { names } = content;
  return (
    <div className="contents">
      <p className="contents__for">for you, <T value={names.her} /> ♡</p>
      <h1 className="contents__title">Our Little <em>Universe</em></h1>
      <p className="contents__heading">Contents</p>
      <ol className="toc">
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <button type="button" onClick={() => goTo(pageOf(c.id))}>
              <span className="toc__num">{ROMAN[i]}.</span>
              <span className="toc__title">{c.title}</span>
              <span className="toc__dots" aria-hidden="true" />
              <span className="toc__page"><span className="visually-hidden">page </span>{pageOf(c.id) + 1}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="contents__hint">swipe, or tap the edge of the page, to turn it ♡</p>
    </div>
  );
}
