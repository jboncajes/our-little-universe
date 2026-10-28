import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { content } from "../content/content";
import { T, cx } from "../lib/text";
import { Icon, Polaroid } from "./ui";

type Phase = "gate" | "ready" | "opening";

const normalize = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");

/** The front of the closed book: the title, the playful entrance question and the envelope. */
export function Cover({ onOpen }: { onOpen: () => void }) {
  const { cover, entrance, names } = content;
  const answers = useMemo(() => entrance.answers.map(normalize).filter(Boolean), [entrance.answers]);
  const gated = entrance.enabled && answers.length > 0;

  const [phase, setPhase] = useState<Phase>(gated ? "gate" : "ready");
  const [answer, setAnswer] = useState("");
  const [tries, setTries] = useState(0);
  const [message, setMessage] = useState("");
  const [announce, setAnnounce] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (phase === "ready" && gated) openRef.current?.focus();
  }, [phase, gated]);

  // The book swings this cover open on its spine.
  const openBook = () => {
    setPhase("opening");
    onOpen();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (answers.includes(normalize(answer))) {
      setPhase("ready");
      setAnnounce("That's right. Your book is ready to open.");
      return;
    }
    const n = tries + 1;
    const replies = entrance.wrongReplies.length ? entrance.wrongReplies : ["Hmm, not quite. Try again ♡"];
    setTries(n);
    setMessage(n >= 3 && entrance.hint ? entrance.hint : replies[(n - 1) % replies.length]);
    inputRef.current?.select();
  };

  // With the question on, the envelope opens as her reward for answering; otherwise as the book opens.
  const envelopeOpen = gated ? phase !== "gate" : phase === "opening";

  return (
    <section className="cover" id="cover" aria-labelledby="cover-title">
      <div className="cover__paper">
        <Icon name="sprig" className="doodle doodle--sprig" />
        <Icon name="star" className="doodle doodle--star-a" />
        <Icon name="star" className="doodle doodle--star-b" />

        <p className="cover__eyebrow">for you, <T value={names.her} /> ♡</p>
        <h1 className="cover__title" id="cover-title">Our Little <em>Universe</em></h1>
        <T as="p" className="cover__subtitle" value={cover.subtitle} />

        <div className="cover__art">
          <Polaroid photo={cover.photo} tape lazy={false} className="polaroid--cover" />
          <div className={cx("envelope envelope--cover", envelopeOpen && "is-open")} id="envelope" aria-hidden="true">
            <span className="envelope__back" />
            <span className="envelope__letter"><T className="envelope__note" value={cover.envelopeNote} /></span>
            <span className="envelope__front" />
            <span className="envelope__flap" />
            <span className="envelope__seal"><Icon name="heart" /></span>
          </div>
        </div>

        <div className="cover__actions">
          {phase === "gate" && (
            <form className={cx("gate", tries > 0 && "is-wrong")} id="gate" noValidate onSubmit={submit}>
              <label className="gate__label" htmlFor="gate-input">{entrance.question}</label>
              <div className="gate__row" key={tries}>
                <input
                  ref={inputRef}
                  className="gate__input"
                  id="gate-input"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-describedby="gate-msg"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <button className="btn btn--primary" type="submit">Unlock ♡</button>
              </div>
              <p className="gate__msg" id="gate-msg" aria-live="polite">{message}</p>
            </form>
          )}
          {phase !== "gate" && (
            <button ref={openRef} className="btn btn--primary btn--lg" id="open-book" type="button" onClick={openBook} disabled={phase === "opening"}>
              Open our book ♡
            </button>
          )}
        </div>
        <p className="visually-hidden" aria-live="polite">{announce}</p>
      </div>
    </section>
  );
}
