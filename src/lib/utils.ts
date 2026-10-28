import type { CSSProperties } from "react";
import { isPlaceholder } from "./text";
import type { SiteContent } from "../content/types";

/** Gentle, varied scrapbook rotations (deterministic so they don't jump between renders). */
const ROTATIONS = [-2.4, 1.6, -1.1, 2.3, -1.7, 0.9, -0.6, 1.9];
export const rot = (i: number, scale = 1): number =>
  Number((ROTATIONS[((i % ROTATIONS.length) + ROTATIONS.length) % ROTATIONS.length] * scale).toFixed(2));

/** Typed helper for CSS custom properties: vars({ "--rot": "2deg" }) */
export const vars = (v: Record<`--${string}`, string | number>): CSSProperties => v as CSSProperties;

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ---------- time together ---------- */
function addMonths(date: Date, n: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + n, 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(date.getDate(), lastDay));
  return d;
}
const utcDay = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

/** Calendar-correct "X years, Y months, Z days" since a YYYY-MM-DD date, or null if invalid/future. */
export function timeTogether(raw: string | null, now = new Date()): { label: string; totalDays: number } | null {
  if (!raw) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) {
    console.warn('relationshipStartDate should look like "YYYY-MM-DD".');
    return null;
  }
  const start = new Date(+m[1], +m[2] - 1, +m[3]);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (Number.isNaN(start.getTime()) || start > today) return null;

  let months = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth());
  if (addMonths(start, months) > today) months -= 1;
  const days = Math.round((utcDay(today) - utcDay(addMonths(start, months))) / 864e5);
  const totalDays = Math.round((utcDay(today) - utcDay(start)) / 864e5);
  const years = Math.floor(months / 12);
  const rest = months % 12;

  const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const parts: string[] = [];
  if (years) parts.push(plural(years, "year"));
  if (rest) parts.push(plural(rest, "month"));
  if (days || !parts.length) parts.push(plural(days, "day"));
  return { label: parts.join(", "), totalDays };
}

/* ---------- editing checklist ---------- */
export function collectPlaceholders(content: SiteContent): string[] {
  const found: string[] = [];
  const skipTop = new Set(["settings", "entrance"]);
  if (!content.music.tracks.some((t) => t.src)) skipTop.add("music");

  const walk = (node: unknown, trail: string[]): void => {
    if (typeof node === "string") {
      if (isPlaceholder(node)) found.push(trail.join(" › "));
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, i) => {
        let name: string | null = null;
        if (item && typeof item === "object") {
          const { label, title } = item as { label?: string; title?: string };
          if (label && !isPlaceholder(label)) name = label;
          else if (title && !isPlaceholder(title)) name = title;
        }
        walk(item, trail.concat(name ?? `#${i + 1}`));
      });
      return;
    }
    if (node && typeof node === "object") {
      const obj = node as Record<string, unknown>;
      if ("suggested" in obj && !obj.src) found.push(trail.concat(`photo (${String(obj.suggested)})`).join(" › "));
      for (const [key, value] of Object.entries(obj)) {
        if (trail.length === 0 && skipTop.has(key)) continue;
        if (key === "suggested" || key === "src") continue;
        walk(value, trail.concat(key));
      }
    }
  };
  walk(content, []);
  if (!content.relationshipStartDate) found.push("relationshipStartDate (optional — the counter stays hidden until set)");
  return found;
}

/** Splits a list into pages of `size` items. */
export const chunk = <T>(items: readonly T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));
