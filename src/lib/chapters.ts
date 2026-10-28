/** The book's chapters, in order. Used by the contents page, the edge tabs and the running heads. */
export const CHAPTERS = [
  { id: "story", title: "Our story, one month at a time", tab: "Our story" },
  { id: "letters", title: "Letters I wrote for you", tab: "Letters" },
  { id: "us", title: "My favorite thing about us", tab: "Us" },
  { id: "little-things", title: "The little things I love about you", tab: "Little things" },
  { id: "forever", title: "Our little forever", tab: "Forever" },
  { id: "last-thing", title: "One last thing", tab: "Always" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export const chapter = (id: ChapterId) => CHAPTERS.find((c) => c.id === id)!;
