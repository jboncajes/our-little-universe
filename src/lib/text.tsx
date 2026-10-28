import { createElement, type ElementType, type HTMLAttributes } from "react";

const PLACEHOLDER = /\[\[[\s\S]*?\]\]/;

export const isPlaceholder = (v: unknown): v is string => typeof v === "string" && PLACEHOLDER.test(v);

/** Strips the [[ ]] markers so placeholders read naturally on the page. */
export const clean = (v?: string | null): string => (v ?? "").replace(/\[\[|\]\]/g, "");

export const cx = (...classes: Array<string | false | null | undefined>): string | undefined =>
  classes.filter(Boolean).join(" ") || undefined;

type TextProps = {
  as?: ElementType;
  value?: string | null;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

/** Renders content text; placeholders get the `is-placeholder` class. */
export function T({ as = "span", value, className, ...rest }: TextProps) {
  return createElement(as, { ...rest, className: cx(className, isPlaceholder(value) && "is-placeholder") }, clean(value));
}

/** Turns **words** into bold, the way they're written in the letters. */
const inline = (p: string) =>
  p.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part) ? <strong key={i}>{part.slice(2, -2)}</strong> : part);

/** Splits text on blank lines into <p>s. Single line breaks are kept by CSS (white-space: pre-line). */
export function Paragraphs({ value, className, as = "div" }: { value?: string; className?: string; as?: ElementType }) {
  const text = clean(value).replace(/\r\n?/g, "\n").trim();
  const paragraphs = text
    ? text.split(/\n\s*\n/).map((p) => p.replace(/^\n+|\n+$/g, "")).filter((p) => p.trim())
    : [];
  return createElement(
    as,
    { className: cx(className, isPlaceholder(value) && "is-placeholder") },
    paragraphs.map((p, i) => <p key={i}>{inline(p)}</p>),
  );
}
