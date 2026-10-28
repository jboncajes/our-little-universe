/* Letters saved as text files in src/content/letters/ (month-01.txt … month-11.txt, and
   anniversary.txt for the last page) are used in place of the text in content.ts. */
import type { MonthLetter } from "./types";

const files = import.meta.glob<string>("./letters/*.txt", { query: "?raw", import: "default", eager: true });

// Notepad may save a byte-order mark at the start; it isn't part of the letter.
const fileText = (name: string): string | undefined => {
  const text = files[`./letters/${name}.txt`]?.replace(/^\uFEFF/, "");
  return text?.trim() ? text : undefined;
};

/** The anniversary letter: anniversary.txt if it's there, otherwise the fallback from content.ts. */
export const anniversaryText = (fallback: string): string => fileText("anniversary") ?? fallback;

/** The letter to show for a month: its text file if there is one, otherwise content.ts. */
export function letterText(month: MonthLetter, index: number): string {
  const number = Number(month.label.match(/\d+/)?.[0] ?? index + 1);
  return fileText(`month-${String(number).padStart(2, "0")}`) ?? month.letter;
}
