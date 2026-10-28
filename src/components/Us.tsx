import { useRef, useState } from "react";
import { content } from "../content/content";
import type { Reason } from "../content/types";
import { T, cx } from "../lib/text";
import { chunk, rot, vars } from "../lib/utils";
import type { BookPage } from "./Book";
import { ChapterOpener, Icon } from "./ui";

const NOTES_PER_PAGE = 4;

function ReasonNote({ reason, index }: { reason: Reason; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="reason">
      <button
        className={cx("reason__card", open && "is-flipped")}
        type="button"
        aria-expanded={open}
        style={vars({ "--rot": `${rot(index + 3, 0.45)}deg` })}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={cx("reason__face reason__front", index % 3 === 1 && "tape")} aria-hidden={open}>
          <span className="reason__num">no. {String(index + 1).padStart(2, "0")}</span>
          <T className="reason__title" value={reason.title} />
          <span className="reason__hint">lift the flap <Icon name="heart" /></span>
        </span>
        <span className="reason__face reason__back" aria-hidden={!open}>
          <T className="reason__kicker" value={reason.title} />
          <T className="reason__text" value={reason.text} />
          <span className="reason__hint">fold it back</span>
        </span>
      </button>
    </li>
  );
}

function Reminder({ notes }: { notes: string[] }) {
  const [note, setNote] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const last = useRef(-1);

  const pick = () => {
    let i = Math.floor(Math.random() * notes.length);
    if (notes.length > 1 && i === last.current) {
      i = (i + 1 + Math.floor(Math.random() * (notes.length - 1))) % notes.length;
    }
    last.current = i;
    setNote(notes[i]);
    setVersion((v) => v + 1);
  };

  return (
    <div className="reminder" id="reminder">
      <p className="reminder__eyebrow">for the days you need it</p>
      <h3 className="reminder__title">A little reminder for you</h3>
      {/* key restarts the gentle reveal animation on every pick */}
      <T
        as="p"
        key={version}
        id="reminder-note"
        className={cx("reminder__note", version > 0 && "is-new")}
        aria-live="polite"
        value={note ?? "Pull one out whenever you need it ♡"}
      />
      <button className="btn btn--primary" id="reminder-btn" type="button" onClick={pick}>
        {version ? "Another one ♡" : "Pull out a note ♡"}
      </button>
    </div>
  );
}

/** Chapter three — twelve lift-the-flap notes, then the jar of reminders. */
export function usPages(): BookPage[] {
  const { reasons, reminders, sections } = content;
  const notes = reminders.filter(Boolean);
  return [
    { key: "us", chapter: "us", plain: true, content: <ChapterOpener id="us" {...sections.us} /> },
    ...chunk(reasons, NOTES_PER_PAGE).map((group, g): BookPage => ({
      key: `us-${g}`,
      chapter: "us",
      content: (
        <ol className="reasons" start={g * NOTES_PER_PAGE + 1}>
          {group.map((r, k) => {
            const i = g * NOTES_PER_PAGE + k;
            return <ReasonNote key={i} reason={r} index={i} />;
          })}
        </ol>
      ),
    })),
    ...(notes.length ? [{ key: "us-reminder", chapter: "us", content: <Reminder notes={notes} /> } satisfies BookPage] : []),
  ];
}
