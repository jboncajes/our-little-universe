/** Shapes for everything in content.ts. TypeScript will flag a typo or a missing field. */
import type { ChapterId } from "../lib/chapters";

export interface Photo {
  /** Path inside /public, e.g. "photos/month-02.webp". null shows a placeholder. */
  src: string | null;
  /** Filename hint shown on the placeholder until src is set. */
  suggested?: string;
  /** Describes the photo for screen readers. */
  alt: string;
  /** Short handwritten caption under the polaroid. */
  caption?: string;
  /** Aspect ratio of the frame: "4/5", "1/1", "3/4", "4/3"… */
  ratio?: string;
}

export interface MonthLetter {
  label: string;
  title: string;
  excerpt?: string;
  photo?: Photo;
  /** The complete original letter. Blank lines separate paragraphs. */
  letter: string;
}

export interface Reason {
  title: string;
  text: string;
}

export type GalleryItem =
  | (Photo & { type?: "photo" })
  | { type: "note"; text: string };

export interface Dream {
  title: string;
  note: string;
}

export interface SectionCopy {
  eyebrow: string;
  intro?: string;
}

export interface MusicTrack {
  /** The song's name; screen readers hear it, and it shows briefly when the song changes. */
  title: string;
  /** Path inside /public, e.g. "music/our-song.mp3". null leaves the song out. */
  src: string | null;
  /** Chapters this song plays in. Leave it out for the theme, which plays everywhere else. */
  chapters?: ChapterId[];
}

export interface SiteContent {
  settings: { showPlaceholderBadge: boolean };
  names: { her: string; me: string };
  /** "YYYY-MM-DD", or null to hide the counter. */
  relationshipStartDate: string | null;
  music: { tracks: MusicTrack[] };
  entrance: {
    enabled: boolean;
    question: string;
    answers: string[];
    wrongReplies: string[];
    hint?: string;
  };
  cover: {
    subtitle: string;
    dedication: string;
    envelopeNote: string;
    photo: Photo;
  };
  sections: {
    story: SectionCopy;
    letters: SectionCopy;
    us: SectionCopy;
    littleThings: SectionCopy;
    forever: SectionCopy;
    lastThing: SectionCopy;
  };
  months: MonthLetter[];
  reasons: Reason[];
  reminders: string[];
  gallery: GalleryItem[];
  forever: {
    note?: string;
    photos: Photo[];
    dreams: Dream[];
  };
  finale: {
    photo?: Photo;
    /** Heading on the anniversary letter's sheet. */
    letterTitle?: string;
    /** Used only if src/content/letters/anniversary.txt is missing. */
    letter: string;
    closingLine?: string;
    signoff?: string;
    ps?: string;
  };
}
