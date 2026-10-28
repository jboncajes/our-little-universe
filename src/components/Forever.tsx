import { useState } from "react";
import { content } from "../content/content";
import { T, cx } from "../lib/text";
import { chunk } from "../lib/utils";
import { useBook, type BookPage } from "./Book";
import { ChapterOpener, Icon, Polaroid, type IconName } from "./ui";

const DREAM_ICONS: IconName[] = ["star", "heart", "flower"];
const DREAMS_PER_PAGE = 3;

/** Chapter five — photos, a handwritten note and the dreams, written out like a wish list. */
export function foreverPages(): BookPage[] {
  const { forever, sections } = content;
  return [
    { key: "forever", chapter: "forever", plain: true, content: <ChapterOpener id="forever" {...sections.forever} /> },
    {
      key: "forever-photos",
      chapter: "forever",
      content: (
        <div className="forever__photos">
          {forever.photos.map((p, i) => (
            <Polaroid key={i} photo={p} tape={i === 0} rot={i === 0 ? -3 : 2.5} />
          ))}
          {forever.note && <T as="p" className="forever__note" value={forever.note} />}
        </div>
      ),
    },
    ...chunk(forever.dreams, DREAMS_PER_PAGE).map((group, g): BookPage => ({
      key: `dreams-${g}`,
      chapter: "forever",
      className: "page--lined",
      content: (
        <ul className="dreams">
          {group.map((d, k) => {
            const i = g * DREAMS_PER_PAGE + k;
            return (
              <li key={i} className="dream">
                <span className="dream__icon"><Icon name={DREAM_ICONS[i % DREAM_ICONS.length]} /></span>
                <T as="h3" className="dream__title" value={d.title} />
                <T as="p" className="dream__note" value={d.note} />
              </li>
            );
          })}
        </ul>
      ),
    })),
  ];
}

/** The last pages — the anniversary letter in its envelope, the closing words, then the hidden P.S. and "to be continued". */
export function finalePages(onOpenLetter: () => void): BookPage[] {
  const { names, sections } = content;
  return [
    {
      key: "last-thing",
      chapter: "last-thing",
      plain: true,
      content: (
        <article className="finale" aria-labelledby="last-title">
          <T as="p" className="finale__eyebrow" value={sections.lastThing.eyebrow} />
          <h2 className="finale__title" id="last-title">One last thing, <T value={names.her} /></h2>
          {sections.lastThing.intro && <T as="p" className="finale__intro" value={sections.lastThing.intro} />}
          <AnniversaryEnvelope onOpen={onOpenLetter} />
        </article>
      ),
    },
    { key: "closing", chapter: "last-thing", plain: true, content: <Closing /> },
    { key: "the-end", chapter: "last-thing", plain: true, content: <TheEnd /> },
  ];
}

function AnniversaryEnvelope({ onOpen }: { onOpen: () => void }) {
  const [opened, setOpened] = useState(false);
  return (
    <button className="anniv" type="button" onClick={() => { setOpened(true); onOpen(); }}>
      <span className={cx("envelope envelope--anniv", opened && "is-open")} aria-hidden="true">
        <span className="envelope__back" />
        <span className="envelope__letter"><span className="envelope__note">one year ♡</span></span>
        <span className="envelope__front" />
        <span className="envelope__flap" />
        <span className="envelope__seal"><Icon name="heart" /></span>
      </span>
      <span className="anniv__label">{opened ? "read our anniversary letter again" : "open your anniversary letter ♡"}</span>
    </button>
  );
}

function Closing() {
  const { finale } = content;
  return (
    <div className="the-end">
      {finale.photo && <Polaroid photo={finale.photo} tape rot={3} className="the-end__photo" />}
      {finale.closingLine && <T as="p" className="finale__closing" value={finale.closingLine} />}
      {finale.signoff && <T as="p" className="finale__signoff" value={finale.signoff} />}
    </div>
  );
}

function TheEnd() {
  const { finale } = content;
  const { goTo } = useBook();
  const [open, setOpen] = useState(false);

  return (
    <div className="the-end">

      {finale.ps && (
        <div className="secret">
          <button className="secret__btn" id="secret-btn" type="button" aria-expanded={open} aria-controls="secret-ps" onClick={() => setOpen((o) => !o)}>
            <span className={cx("envelope envelope--mini", open && "is-open")} aria-hidden="true">
              <span className="envelope__back" />
              <span className="envelope__letter"><span className="envelope__note">P.S.</span></span>
              <span className="envelope__front" />
              <span className="envelope__flap" />
              <span className="envelope__seal"><Icon name="heart" /></span>
            </span>
            <span className="secret__label">{open ? "Fold it back up" : "One more thing… ♡"}</span>
          </button>
          <T as="p" className="secret__ps" id="secret-ps" value={finale.ps} hidden={!open} />
        </div>
      )}

      <p className="the-end__words">to be continued… <span aria-hidden="true">♡</span></p>
      <p className="the-end__made">made with love, just for you</p>
      <button className="ink-btn" type="button" onClick={() => goTo(0)}>read it again from the start</button>
    </div>
  );
}
