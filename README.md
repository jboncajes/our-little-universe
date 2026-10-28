# Our Little Universe ♡

A handmade digital scrapbook built with **React + TypeScript** (Vite) that reads like a real book: a cloth cover with a playful entrance question, then pages that turn one at a time (or as open two-page spreads on a laptop) — a contents page, a dedication, monthly letters (months 1–11) tucked into envelopes, twelve lift-the-flap notes, polaroid pages, a wish list of dreams, and a final letter with a hidden P.S.

No backend, no database, no tracking, no paid services.

```
our-little-universe/
├── index.html                  page shell + icon sprite + fonts
├── public/
│   ├── photos/                 ← your photos go here
│   └── music/                  ← your (optional) song goes here
├── src/
│   ├── content/
│   │   ├── content.ts          ← ALL personal content lives here
│   │   └── types.ts            shapes for content.ts (catches typos)
│   ├── components/
│   │   ├── Cover.tsx           the closed book: cover, entrance question, envelope
│   │   ├── Book.tsx            page turning, spreads, tabs · contents + dedication pages
│   │   ├── Letters.tsx         ch. 1 month pages · ch. 2 pocket of letters · letter viewer
│   │   ├── Us.tsx              ch. 3 twelve lift-the-flap notes + random reminder
│   │   ├── LittleThings.tsx    ch. 4 polaroid pages + lightbox
│   │   ├── Forever.tsx         ch. 5 our little forever · one last thing + P.S. + to be continued
│   │   ├── Extras.tsx          music button, editing checklist
│   │   └── ui.tsx              Icon, PhotoView, Polaroid, Modal, ChapterOpener
│   ├── lib/                    text + date helpers, chapter list (chapters.ts)
│   ├── styles/                 styles.css (tokens + components), responsive.css
│   ├── App.tsx
│   └── main.tsx
├── .github/workflows/deploy.yml  automatic GitHub Pages deploys
├── package.json · tsconfig.json · vite.config.ts
```

---

## 1. Run it locally

You need **Node.js 20 or newer** ([nodejs.org](https://nodejs.org), the LTS version). Check with `node -v`.

```bash
cd our-little-universe
npm install          # first time only
npm run dev          # opens a live preview at http://localhost:5173
```

Edit `src/content/content.ts`, save, and the page updates instantly. Stop with **Ctrl + C**.

Other commands:

| Command | What it does |
|---|---|
| `npm run typecheck` | Checks `content.ts` and the code for mistakes |
| `npm run build` | Type-checks, then builds the final site into `dist/` |
| `npm run preview` | Serves the built `dist/` locally — check this before publishing |

> Unlike the old plain-HTML version, you can't double-click `index.html`; use `npm run dev` or `npm run preview`.

## 2. Add your photos

1. Put them in `public/photos/`.
2. In `src/content/content.ts`, set each photo's `src` to the path **without** `public/`:
   `src: "photos/month-02.webp"`.
3. Until `src` is set, a soft striped placeholder shows the suggested filename. If a path is wrong, the placeholder appears instead of a broken image.

| Where it appears | Setting in `content.ts` | Suggested file |
|---|---|---|
| Cover polaroid | `cover.photo` | `cover.jpg` ✓ added |
| Month pages, months 1–11 | `months[n].photo` | `month-01.jpg` … `month-11.jpg` ✓ added |
| Little things gallery (12) | `gallery` | `photo-01.webp` … `photo-12.webp` |
| Our little forever (2) | `forever.photos` | `forever-01.webp`, `forever-02.webp` |
| One last thing (closing page) | `finale.photo` | `finale.jpg` ✓ added |

The month photos were cropped to the 4:5 polaroid frame and resized to 1080×1350 for quick loading on a phone. Which photo went where: October 2025 → cover, November 2025 → Month 1, … September 2026 → Month 11, October 2026 → the last page.

**Before adding photos:**
- Resize to about **1600px** on the long side, export as **WebP** (or JPG) at ~80%. [Squoosh](https://squoosh.app) does this free in the browser.
- **Strip location data (EXIF/GPS)** — phone photos often record where they were taken.
- Use neutral filenames (`photo-03.webp`); filenames are visible to anyone.
- Set `ratio` (`"4/5"`, `"1/1"`, `"3/4"`, `"4/3"`) to roughly match each photo so nothing jumps.
- Write a real `alt` description for each photo; screen readers read it aloud.

## 3. Replace the placeholder content

Everything in `[[double brackets]]` in `content.ts` is a placeholder — replace the whole thing, brackets included.

While any remain, a yellow **"things left to personalize"** checklist sits in the bottom-left corner and placeholder text is softly highlighted. Click it to see exactly what's left. It disappears on its own once everything is filled in (or set `settings.showPlaceholderBadge: false`).

Also worth personalizing:
- **`reasons`** — the 12 titles are fixed; rewrite the general explanations using your letters.
- **`reminders`** — the random "A little reminder for you ♡" notes.
- **`forever.dreams`** — keep only dreams you really share; add or remove freely.
- **`finale.closingLine`** — the suggested "ikaw pa rin" line.
- **`entrance`** — the question, accepted answers (`baby`, `hon`), replies and hint.

TypeScript checks the shape of everything — if you misspell a field or forget a comma, `npm run dev` and `npm run typecheck` will tell you which line.

## 4. Edit the monthly letters

Each entry in `months` has `label`, `title`, `excerpt`, `photo` and `letter`. Paste the full letter **between the backticks**, exactly as written:

```ts
letter: `
Hi baby,

First paragraph...

Second paragraph...
`,
```

- A blank line starts a new paragraph; single line breaks are kept.
- Inside a letter, write a backtick as `` \` `` and the characters `${` as `\${`.

## 5. Set the relationship start date

```ts
relationshipStartDate: "2025-11-14",   // YYYY-MM-DD, or null to hide the counter
```

## 6. Background music (three songs)

Songs live in `public/music/` and are listed under `music.tracks` in `content.ts`. A record button appears once the book is open, and **nothing plays until she taps it**. After that, turning into a chapter with a different song fades from one into the next.

| Song | File | Plays in |
|---|---|---|
| You To Me Are Everything (theme) | `you-to-me-are-everything.mp3` | contents, dedication, Our story, Letters (and anywhere without its own song) |
| World of Our Own | `world-of-our-own.mp3` | My favorite thing about us, The little things, Our little forever |
| You're Still the One | `youre-still-the-one.mp3` | One last thing → to be continued |

A song whose file isn't there yet is simply skipped and the theme keeps playing. To move a song to other chapters, change its `chapters` list (chapter ids: `story`, `letters`, `us`, `little-things`, `forever`, `last-thing`). Only use songs you have the right to use.

## 7. Publish free on GitHub Pages

> On a free GitHub account, Pages requires a **public** repository — your letters and photos will be readable in the repo. If that bothers you, use Vercel with a private repo.

1. Create a GitHub repository and push this folder to its `main` branch (don't commit `node_modules` or `dist` — `.gitignore` handles that).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. The included workflow builds and deploys on every push. Watch it under the **Actions** tab.
4. Your site: `https://YOUR-USERNAME.github.io/REPO-NAME/`.

`vite.config.ts` uses `base: "./"`, so it works in that sub-folder without changes.

## 8. Deploy free on Vercel

1. Push the folder to a GitHub repo (it **can be private**).
2. On [vercel.com](https://vercel.com): **Add New → Project**, import the repo.
3. Vercel detects **Vite** automatically (build: `npm run build`, output: `dist`). Click **Deploy**.
4. You get a free `something.vercel.app` URL; every push redeploys.

## 9. What the playful entrance does — and doesn't — protect

The "what do I always call you?" question is **a sweet ritual, not a lock.**

- ✅ It makes opening the gift feel personal.
- ❌ It does **not** hide anything. The answers, letters and photos are bundled into the site's JavaScript and files, readable by anyone who opens developer tools or guesses a photo URL.
- Nothing is stored in cookies or local storage; no analytics; `noindex` asks search engines not to list it.

**For real privacy**, content must be protected by the host before it's served, e.g. **Cloudflare Pages + Cloudflare Access** (email-code sign-in for a few addresses) or a host's password-protection feature (often paid). Check current free-tier terms.

## 10. Check everything after deploying

- [ ] Open the live URL on a phone and a laptop.
- [ ] Answer the entrance question and open the book.
- [ ] Turn pages by tapping a page's outer edge, by swiping (or dragging with a mouse), and with ← → (laptop); try the chapter tabs on a laptop.
- [ ] Open letters from the month pages and the pocket; step between them; close with "fold it back" and Escape.
- [ ] Flip some notes; tap the reminder button a few times.
- [ ] Open a gallery photo; arrows or swipe; close it.
- [ ] Read the dreams pages and open the final P.S.
- [ ] No striped photo placeholders and no yellow checklist remain.
- [ ] If you added music, play and pause it.
- [ ] Browser console (F12 → Console) shows no red errors. A 404 means a wrong path — online, paths are **case-sensitive**.

---

**Accessibility & motion:** everything works by keyboard (Tab, Enter/Space, Escape; ← → / Page Up / Page Down / Home / End turn the pages, and ← → step through letters and photos when one is open), screen readers hear which page they're on, focus returns where she was when a dialog closes, and with "Reduce motion" on, pages change and the cover opens instantly without animating.

**Long content:** each page is a fixed size. If a letter or note is longer than a page has room for, that page scrolls gently inside itself; the monthly letters themselves open on their own sheet, so length never matters there.

**Fonts:** Lora and Caveat load from Google Fonts (the only outside request). To self-host, add the font files under `public/fonts/`, add `@font-face` rules to the top of `src/styles/styles.css`, and remove the Google Fonts `<link>` tags from `index.html`.
