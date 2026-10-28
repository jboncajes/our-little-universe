import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from "react";
import { content } from "../content/content";
import type { MusicTrack } from "../content/types";
import type { ChapterId } from "../lib/chapters";
import { collectPlaceholders } from "../lib/utils";
import { Icon } from "./ui";

const FADE_MS = 900;
const CANT_PLAY = "The song couldn't play — check the files in public/music ♡";

export interface MusicHandle {
  /** Starts the music. Call it straight from a tap (opening the book), so phones allow sound. */
  begin: () => void;
}

/**
 * Background music: a theme song plus songs for particular chapters. It starts with her tap on
 * "Open our book", then each chapter's song plays from the beginning as she turns into it,
 * fading from one song into the next. The record button pauses and resumes.
 * A song whose file is missing is skipped in favour of the theme.
 */
export function MusicButton({ chapter, visible, ref }: { chapter?: ChapterId; visible: boolean; ref?: Ref<MusicHandle> }) {
  const tracks = useMemo(() => content.music.tracks.filter((t) => t.src), []);
  const audio = useRef<HTMLAudioElement | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const failed = useRef(new Set<string>());
  const switching = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState<MusicTrack | null>(null);
  const [toast, setToast] = useState("");

  // The song for a chapter: its own, else the theme (the first song without chapters).
  const songFor = useCallback((id?: ChapterId): MusicTrack | undefined => {
    const ok = tracks.filter((t) => !failed.current.has(t.src!));
    return ok.find((t) => id && t.chapters?.includes(id)) ?? ok.find((t) => !t.chapters?.length) ?? ok[0];
  }, [tracks]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => () => { audio.current?.pause(); void ctx.current?.close(); }, []);

  // Find songs whose file isn't there yet, so the theme keeps playing instead of restarting.
  const [, setChecked] = useState(0);
  useEffect(() => {
    tracks.forEach((t) => {
      fetch(t.src!, { method: "HEAD" })
        .then((r) => {
          if (r.ok && r.headers.get("content-type")?.startsWith("audio")) return;
          failed.current.add(t.src!);
          setChecked((n) => n + 1);
        })
        .catch(() => {});
    });
  }, [tracks]);

  // Volume goes through Web Audio where possible: iPhones ignore an audio element's own volume.
  const fadeTo = (level: number, ms: number) => new Promise<void>((done) => {
    const c = ctx.current, g = gain.current, a = audio.current;
    if (c && g) {
      g.gain.cancelScheduledValues(c.currentTime);
      g.gain.setValueAtTime(g.gain.value, c.currentTime);
      g.gain.linearRampToValueAtTime(level, c.currentTime + ms / 1000);
    } else if (a) {
      a.volume = level;
    }
    window.setTimeout(done, ms);
  });

  // Loads a song and plays it from the beginning, falling back to another if its file is broken.
  // Everything up to a.play() runs straight away, so when called from a tap the tap still counts.
  const start = async (song: MusicTrack | undefined, ticket: number): Promise<void> => {
    const a = audio.current;
    if (!a || !song) { setPlaying(false); setToast(CANT_PLAY); return; }
    a.src = song.src!;
    try {
      await a.play();
      if (ticket !== switching.current) return;
      setNow(song);
      setPlaying(true);
      await fadeTo(1, FADE_MS);
    } catch {
      if (ticket !== switching.current) return;
      failed.current.add(song.src!);
      return start(songFor(chapter), ticket);
    }
  };

  // The audio element and its volume control are made on her first tap, so the browser lets them sound.
  const ensureAudio = () => {
    if (!audio.current) {
      const a = new Audio();
      a.preload = "none";
      a.loop = true;
      audio.current = a;
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        try {
          const c = new AC();
          const g = c.createGain();
          g.gain.value = 0;
          c.createMediaElementSource(a).connect(g).connect(c.destination);
          ctx.current = c;
          gain.current = g;
        } catch { /* plain element playback still works, just without fades on iPhone */ }
      }
    }
    void ctx.current?.resume();
  };

  // Turning into a chapter with a different song: fade out, then that song from the top.
  const want = songFor(chapter);
  useEffect(() => {
    if (!playing || !want || !now) return;
    const ticket = ++switching.current;
    // Back to the song that's playing before a switch finished: cancel it and fade back up.
    if (want.src === now.src) { void fadeTo(1, 400); return; }
    void (async () => {
      await fadeTo(0, FADE_MS);
      if (ticket !== switching.current) return;
      setToast(`♪ ${want.title}`);
      await start(want, ticket);
    })();
  }, [want?.src, playing]);

  const play = () => {
    if (playing || !tracks.length) return;
    const ticket = ++switching.current;
    ensureAudio();
    const a = audio.current!;
    // Paused in the middle of this chapter's song: carry on from where it stopped.
    if (now && want && now.src === want.src && a.src) {
      a.play()
        .then(() => { if (ticket !== switching.current) return; setPlaying(true); return fadeTo(1, 500); })
        .catch(() => setToast(CANT_PLAY));
      return;
    }
    void start(want, ticket);
  };

  const pause = async () => {
    const ticket = ++switching.current;
    setPlaying(false);
    await fadeTo(0, 300);
    if (ticket === switching.current) audio.current?.pause();
  };

  useImperativeHandle(ref, () => ({ begin: play }));

  if (!tracks.length) return null;

  const title = (playing ? now : want)?.title ?? "our song";

  return (
    <>
      {visible && (
        <button className="music" id="music" type="button" data-playing={playing} aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          onClick={() => (playing ? void pause() : play())}>
          <span className="music__icon" aria-hidden="true">
            <Icon name="play" className="music__play" />
            <span className="music__bars"><span /><span /><span /></span>
          </span>
        </button>
      )}
      <div className={toast ? "toast is-visible" : "toast"} role="status" aria-live="polite">{toast}</div>
    </>
  );
}

/** While placeholders remain, a small checklist in the corner lists them. */
export function PlaceholderBadge() {
  const items = useMemo(() => (content.settings.showPlaceholderBadge ? collectPlaceholders(content) : []), []);

  useEffect(() => {
    document.documentElement.classList.toggle("show-placeholders", items.length > 0);
  }, [items.length]);

  if (!items.length) return null;
  return (
    <div className="ph-badge" id="ph-badge">
      <details>
        <summary>✎ {items.length} thing{items.length === 1 ? "" : "s"} left to personalize</summary>
        <p>Edit these in src/content/content.ts. This note disappears on its own once they're all filled in.</p>
        <ul>{items.map((f) => <li key={f}>{f}</li>)}</ul>
      </details>
    </div>
  );
}
