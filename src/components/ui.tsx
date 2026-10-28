/* Small shared building blocks: Icon, PhotoView, Polaroid, Modal, ChapterOpener. */
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { Photo } from "../content/types";
import { T, clean, cx } from "../lib/text";
import { chapter, type ChapterId } from "../lib/chapters";
import { vars } from "../lib/utils";

export type IconName =
  | "heart" | "star" | "flower" | "sprig" | "arrow-right" | "arrow-left" | "arrow-down" | "close" | "menu" | "play";

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={cx("icon", className)} aria-hidden="true" focusable="false">
      <use href={`#i-${name}`} />
    </svg>
  );
}

/** A photo, or a soft labelled placeholder when there's no file (or it fails to load). */
export function PhotoView({ photo, lazy = true }: { photo?: Photo; lazy?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photo?.src]);

  const showPlaceholder = !photo?.src || failed;
  const file = photo?.suggested?.split("/").pop();
  return (
    <span className={cx("photo", showPlaceholder && "photo--placeholder")} style={vars({ "--ratio": photo?.ratio ?? "4/5" })}>
      {showPlaceholder ? (
        <span className="photo__ph" role="img" aria-label="Photo placeholder">
          <Icon name="heart" />
          <strong>a photo goes here</strong>
          {file && <code>{file}</code>}
        </span>
      ) : (
        <img
          loading={lazy ? "lazy" : "eager"}
          decoding="async"
          src={photo!.src!}
          alt={clean(photo!.alt)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

interface PolaroidProps {
  photo?: Photo;
  tape?: boolean;
  rot?: number;
  className?: string;
  lazy?: boolean;
  /** Replaces the photo area (e.g. a button wrapping the photo). */
  children?: ReactNode;
}

export function Polaroid({ photo, tape, rot, className, lazy, children }: PolaroidProps) {
  return (
    <figure className={cx("polaroid", tape && "tape", className)} style={rot != null ? vars({ "--rot": `${rot}deg` }) : undefined}>
      {children ?? <PhotoView photo={photo} lazy={lazy} />}
      {photo?.caption && <T as="figcaption" value={photo.caption} />}
    </figure>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  labelledBy?: string;
  label?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLDialogElement>) => void;
  children: ReactNode;
}

/**
 * Native <dialog> as a modal: traps focus, closes on Escape and backdrop click,
 * locks page scroll, and returns focus to whatever opened it.
 */
export function Modal({ open, onClose, className, labelledBy, label, onKeyDown, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      document.documentElement.classList.add("modal-open");
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      if (!document.querySelector("dialog[open]")) document.documentElement.classList.remove("modal-open");
      returnTo.current?.focus({ preventScroll: true });
      onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <dialog
      ref={ref}
      className={cx("dlg", className)}
      aria-labelledby={labelledBy}
      aria-label={label}
      onKeyDown={onKeyDown}
      onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}
    >
      {children}
    </dialog>
  );
}

/** A chapter's title page: eyebrow, title, a little flourish and the intro. */
export function ChapterOpener({ id, eyebrow, intro, children }: {
  id: ChapterId; eyebrow?: string; intro?: string; children?: ReactNode;
}) {
  return (
    <div className="opener">
      <Icon name="sprig" className="doodle opener__sprig" />
      {eyebrow && <T as="p" className="opener__eyebrow" value={eyebrow} />}
      <h2 className="opener__title">{chapter(id).title}</h2>
      <span className="opener__flourish" aria-hidden="true"><Icon name="heart" /></span>
      {intro && <T as="p" className="opener__intro" value={intro} />}
      {children}
    </div>
  );
}
