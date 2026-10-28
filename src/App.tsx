import { useCallback, useMemo, useRef, useState } from "react";
import { Book, Contents, Dedication, type BookPage } from "./components/Book";
import { Cover } from "./components/Cover";
import { MusicButton, PlaceholderBadge, type MusicHandle } from "./components/Extras";
import { finalePages, foreverPages } from "./components/Forever";
import { AnniversaryDialog, LetterDialog, letterPages, storyPages } from "./components/Letters";
import { Lightbox, galleryPhotos, littleThingsPages } from "./components/LittleThings";
import { usPages } from "./components/Us";
import { CHAPTERS, type ChapterId } from "./lib/chapters";

// Arriving with a link like …/#letters turns to that chapter once the book is open.
const hash = decodeURIComponent(window.location.hash.slice(1));
const initialChapter = CHAPTERS.find((c) => c.id === hash)?.id as ChapterId | undefined;

export default function App() {
  const [opened, setOpened] = useState(false);
  const [letter, setLetter] = useState<number | null>(null);
  const [photo, setPhoto] = useState<number | null>(null);
  const [anniversary, setAnniversary] = useState(false);
  const [chapter, setChapter] = useState<ChapterId | undefined>(undefined);
  const music = useRef<MusicHandle>(null);

  const handleOpened = useCallback(() => setOpened(true), []);
  const closeLetter = useCallback(() => setLetter(null), []);

  const pages = useMemo<BookPage[]>(() => [
    { key: "contents", plain: true, content: <Contents /> },
    { key: "dedication", plain: true, content: <Dedication /> },
    ...storyPages(setLetter),
    ...letterPages(setLetter),
    ...usPages(),
    ...littleThingsPages(setPhoto),
    ...foreverPages(),
    ...finalePages(() => setAnniversary(true)),
  ], []);

  return (
    <>
      <main id="main">
        <Book pages={pages} initialChapter={initialChapter} cover={(open) => <Cover onOpen={() => { music.current?.begin(); open(); }} />} onOpened={handleOpened} onChapter={setChapter} />
      </main>

      <LetterDialog index={letter} onChange={setLetter} onClose={closeLetter} />
      <AnniversaryDialog open={anniversary} onClose={() => setAnniversary(false)} />
      <Lightbox photos={galleryPhotos} index={photo} onIndex={setPhoto} onClose={() => setPhoto(null)} />
      {/* mounted from the start, so the music can begin on the tap that opens the book */}
      <MusicButton ref={music} chapter={chapter} visible={opened} />
      <PlaceholderBadge />
    </>
  );
}
