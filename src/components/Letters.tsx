import { useEffect, useRef, type KeyboardEvent } from "react";
import { content } from "../content/content";
import { anniversaryText, letterText } from "../content/letters";
import type { MonthLetter } from "../content/types";
import { Paragraphs, T, clean } from "../lib/text";
import { chunk, rot, timeTogether, vars } from "../lib/utils";
import type { BookPage } from "./Book";
import { ChapterOpener, Icon, Modal, Polaroid } from "./ui";

type OpenLetter = (index: number) => void;

const POCKET_SIZE = 6;

/** Chapter one — a page per month: a photo, a few words, and the letter tucked in an envelope. */
export function storyPages(onRead: OpenLetter): BookPage[] {
  const { months, sections, relationshipStartDate } = content;
  const together = timeTogether(relationshipStartDate);

  return [
    {
      key: "story",
      chapter: "story",
      plain: true,
      content: (
        <ChapterOpener id="story" {...sections.story}>
          {together && (
            <p className="counter" id="counter">
              <span>together for</span>
              <strong>{together.label}</strong>
              <span>that's {together.totalDays.toLocaleString()} days ♡</span>
            </p>
          )}
        </ChapterOpener>
      ),
    },
    ...months.map((m, i): BookPage => ({
      key: `month-${i}`,
      chapter: "story",
      content: <MonthPage month={m} index={i} onRead={onRead} />,
    })),
  ];
}

function MonthPage({ month: m, index: i, onRead }: { month: MonthLetter; index: number; onRead: OpenLetter }) {
  return (
    <article className="month" aria-labelledby={`month-label-${i} month-title-${i}`}>
      <Polaroid photo={m.photo} tape={i % 2 === 0} rot={rot(i + 1)} className="month__photo" />
      <T as="p" className="month__label" id={`month-label-${i}`} value={m.label} />
      <T as="h3" className="month__title" id={`month-title-${i}`} value={m.title} />
      {m.excerpt && <T as="p" className="month__excerpt" value={m.excerpt} />}
      <button className="tucked" type="button" style={vars({ "--rot": `${rot(i + 4, 0.8)}deg` })}
        aria-label={`Read our ${clean(m.label)} letter`} onClick={() => onRead(i)}>
        <span className="tucked__env" aria-hidden="true">
          <span className="tucked__flap" />
          <span className="tucked__seal"><Icon name="heart" /></span>
        </span>
        <span className="tucked__label" aria-hidden="true">your letter is tucked in here</span>
      </button>
    </article>
  );
}

/** Chapter two — every letter, kept together in a paper pocket. */
export function letterPages(onRead: OpenLetter): BookPage[] {
  const { months, sections } = content;
  return [
    { key: "letters", chapter: "letters", plain: true, content: <ChapterOpener id="letters" {...sections.letters} /> },
    ...chunk(months, POCKET_SIZE).map((group, g): BookPage => ({
      key: `letters-${g}`,
      chapter: "letters",
      content: (
        <ul className="pocket">
          {group.map((m, k) => {
            const i = g * POCKET_SIZE + k;
            return (
              <li key={i}>
                <button className="env-card" type="button" style={vars({ "--rot": `${rot(i + 2, 0.6)}deg` })} onClick={() => onRead(i)}>
                  <span className="env-card__flap" aria-hidden="true" />
                  <span className="env-card__seal" aria-hidden="true"><Icon name="heart" /></span>
                  <T className="env-card__label" value={m.label} />
                  <T className="env-card__title" value={m.title} />
                </button>
              </li>
            );
          })}
        </ul>
      ),
    })),
  ];
}

/** The letter itself, unfolded on top of the book. Shared by the month pages and the pocket. */
export function LetterDialog({ index, onChange, onClose }: {
  index: number | null; onChange: (i: number) => void; onClose: () => void;
}) {
  const { months } = content;
  const letter = index != null ? months[index] : null;
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [index]);

  const step = (dir: -1 | 1) => {
    if (index == null) return;
    const n = index + dir;
    if (n < 0 || n >= months.length) return;
    onChange(n);
    // if the button just pressed becomes disabled, keep focus somewhere useful
    const atEdge = (dir < 0 && n === 0) || (dir > 0 && n === months.length - 1);
    if (atEdge) {
      requestAnimationFrame(() => {
        const other = dir < 0 ? nextRef.current : prevRef.current;
        (other && !other.disabled ? other : closeRef.current)?.focus();
      });
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  };

  const prev = index != null && index > 0 ? months[index - 1] : null;
  const next = index != null && index < months.length - 1 ? months[index + 1] : null;

  return (
    <Modal open={letter != null} onClose={onClose} className="dlg--letter" labelledBy="letter-title" onKeyDown={onKeyDown}>
      <div className="letter" id="letter-dialog">
        <button ref={closeRef} className="ink-btn letter__fold" type="button" data-close aria-label="Fold the letter back up" onClick={onClose}>
          fold it back <Icon name="close" />
        </button>
        <div className="letter__scroll" ref={scrollRef} tabIndex={0} role="region" aria-label="Letter text">
          <header className="letter__head">
            <T as="p" className="letter__label" value={letter?.label} />
            <T as="h2" className="letter__title" id="letter-title" value={letter?.title} />
          </header>
          <Paragraphs className="letter__body" value={letter && index != null ? letterText(letter, index) : undefined} />
        </div>
        <footer className="letter__foot">
          <button ref={prevRef} className="ink-btn" type="button" data-prev disabled={!prev}
            aria-label={prev ? `Previous letter: ${clean(prev.label)}` : "Previous letter"} onClick={() => step(-1)}>
            <Icon name="arrow-left" /><span>{prev ? clean(prev.label) : ""}</span>
          </button>
          <span className="letter__pos">{index != null ? `${index + 1} of ${months.length}` : ""}</span>
          <button ref={nextRef} className="ink-btn" type="button" data-next disabled={!next}
            aria-label={next ? `Next letter: ${clean(next.label)}` : "Next letter"} onClick={() => step(1)}>
            <span>{next ? clean(next.label) : ""}</span><Icon name="arrow-right" />
          </button>
        </footer>
      </div>
    </Modal>
  );
}

/** The anniversary letter, unfolded on its own sheet like the monthly ones. */
export function AnniversaryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { finale } = content;
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open && scrollRef.current) scrollRef.current.scrollTop = 0; }, [open]);

  return (
    <Modal open={open} onClose={onClose} className="dlg--letter" labelledBy="anniversary-title">
      <div className="letter letter--anniversary">
        <button className="ink-btn letter__fold" type="button" data-close aria-label="Fold the letter back up" onClick={onClose}>
          fold it back <Icon name="close" />
        </button>
        <div className="letter__scroll" ref={scrollRef} tabIndex={0} role="region" aria-label="Letter text">
          <header className="letter__head">
            <p className="letter__label">One year ♡</p>
            <T as="h2" className="letter__title" id="anniversary-title" value={finale.letterTitle} />
          </header>
          <Paragraphs className="letter__body" value={anniversaryText(finale.letter)} />
        </div>
        <footer className="letter__foot letter__foot--center">
          <span className="letter__pos">our first year</span>
        </footer>
      </div>
    </Modal>
  );
}
