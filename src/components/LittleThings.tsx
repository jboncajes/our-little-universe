import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { content } from "../content/content";
import type { Photo } from "../content/types";
import { T, clean } from "../lib/text";
import { chunk, rot, vars } from "../lib/utils";
import type { BookPage } from "./Book";
import { ChapterOpener, Icon, Modal, PhotoView, Polaroid } from "./ui";

const ITEMS_PER_PAGE = 4;

const isNote = (item: (typeof content.gallery)[number]): item is { type: "note"; text: string } => item.type === "note";

/** Just the photos from the gallery, in order — what the lightbox steps through. */
export const galleryPhotos = content.gallery.filter((item): item is Photo & { type?: "photo" } => !isNote(item));

export function Lightbox({ photos, index, onIndex, onClose }: {
  photos: Photo[]; index: number | null; onIndex: (i: number) => void; onClose: () => void;
}) {
  const touchX = useRef<number | null>(null);
  const photo = index != null ? photos[index] : null;
  const single = photos.length < 2;
  const go = (dir: number) => { if (index != null && !single) onIndex((index + dir + photos.length) % photos.length); };

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  };
  const onTouchStart = (e: TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <Modal open={photo != null} onClose={onClose} className="dlg--lightbox" label="Photo viewer" onKeyDown={onKeyDown}>
      <div className="lightbox" id="lightbox" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <button className="ink-btn lightbox__close" type="button" data-close aria-label="Put the photo back" onClick={onClose}>
          put it back <Icon name="close" />
        </button>
        {photo && (
          <figure className="lightbox__figure">
            <div className="lightbox__media" id="lightbox-media">
              {photo.src ? <LightboxImage photo={photo} key={photo.src} /> : <PhotoView photo={photo} />}
            </div>
            {photo.caption && <T as="figcaption" className="lightbox__caption" value={photo.caption} />}
          </figure>
        )}
        <div className="lightbox__controls">
          {!single && <button className="ink-btn lightbox__btn" type="button" aria-label="Previous photo" onClick={() => go(-1)}><Icon name="arrow-left" /></button>}
          <span className="lightbox__count" id="lightbox-count" aria-live="polite">{index != null ? `${index + 1} / ${photos.length}` : ""}</span>
          {!single && <button className="ink-btn lightbox__btn" type="button" aria-label="Next photo" onClick={() => go(1)}><Icon name="arrow-right" /></button>}
        </div>
      </div>
    </Modal>
  );
}

function LightboxImage({ photo }: { photo: Photo }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <PhotoView photo={{ ...photo, src: null }} />;
  return <img src={photo.src!} alt={clean(photo.alt)} decoding="async" onError={() => setFailed(true)} />;
}

/** Chapter four — polaroids and paper notes, a few to a page. */
export function littleThingsPages(onOpen: (photoIndex: number) => void): BookPage[] {
  const { gallery, sections } = content;
  let photoIndex = 0;
  const items = gallery.map((item, i) => ({ item, i, photo: isNote(item) ? -1 : photoIndex++ }));

  return [
    { key: "little-things", chapter: "little-things", plain: true, content: <ChapterOpener id="little-things" {...sections.littleThings} /> },
    ...chunk(items, ITEMS_PER_PAGE).map((group, g): BookPage => ({
      key: `little-things-${g}`,
      chapter: "little-things",
      content: (
        <div className="gallery">
          {group.map(({ item, i, photo }) => {
            if (isNote(item)) {
              return <p key={i} className="g-note" style={vars({ "--rot": `${rot(i + 3)}deg` })}><T value={item.text} /></p>;
            }
            const desc = clean(item.alt) || clean(item.caption) || `photo ${photo + 1}`;
            return (
              <div key={i} className="g-item">
                <Polaroid photo={item} rot={rot(i)} tape={i % 3 === 0}>
                  <button className="g-open" type="button" aria-label={`Hold up photo: ${desc}`} onClick={() => onOpen(photo)}>
                    <PhotoView photo={item} />
                  </button>
                </Polaroid>
              </div>
            );
          })}
        </div>
      ),
    })),
  ];
}
