"use client";

import { useEffect, useRef, useState } from "react";
import { templates } from "./templates";
import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { FlipbookTheme } from "./PdfFlipbookViewer";

const CARD_WIDTH = 220;

/** Look up a template by id, e.g. after TemplateSelector's onChange fires. */
export function getTemplateById(id: string) {
  return templates.find((t) => t.id === id) ?? templates[0];
}

// ---------------------------------------------------------------------------
// Color utilities
// ---------------------------------------------------------------------------
// These exist so templateToFlipbookTheme never has to fall back to reusing
// the *same* color for primary/secondary/accent. Reusing the same color was
// the root cause of "some templates look fine, others look like one flat
// slab": any template whose `swatch` only supplied 1-2 colors ended up with
// secondary === primary and/or accent === secondary, so the cover gradient
// had no gradient and the accent borders/text became invisible against the
// cover. Now missing colors are *derived* from the ones that exist.

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Mixes `hex` toward black by `amount` (0-1). Used to derive a darker
 *  "secondary" (spine) shade from a template's single cover color. */
function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

/** Mixes `hex` toward white by `amount` (0-1). Used to derive a lighter
 *  accent from a dark cover color. */
function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount
  );
}

/** Standard relative luminance (0 = black, 1 = white), used to decide
 *  whether a color reads as "light" or "dark" for contrast purposes. */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

const isLight = (hex: string) => luminance(hex) > 0.55;

/** Derives an accent that will actually be visible against `base` — lighter
 *  for dark covers, darker for light/pastel covers (e.g. Minimal, Rustic
 *  Ivory templates) — instead of assuming every template is a dark jewel
 *  tone the way the maroon default was. */
function deriveAccent(base: string): string {
  return isLight(base) ? darken(base, 0.4) : lighten(base, 0.5);
}

/** Text/title color for content sitting on top of `base`. */
function contrastText(base: string): string {
  return isLight(base) ? "#3d2b1f" : "#fbf5e9";
}

/**
 * Maps a template's swatch (the 2-3 color dots shown on its card) to the
 * flipbook's theme shape, so selecting a template can restyle the book's
 * cover, controls, and header leaf.
 *
 * Swatch order is assumed [primary, secondary, accent], but templates are
 * free to supply just one color. Any color not supplied is *derived* from
 * the ones that are, so every template — not just the ones with a full
 * 3-color swatch — ends up with a real gradient and a visible accent,
 * instead of secondary/accent silently collapsing to the same value as
 * primary.
 */
export function templateToFlipbookTheme(templateId: string): FlipbookTheme {
  const template = getTemplateById(templateId);
  const swatch = template.swatch.filter(Boolean);

  const primary = swatch[0] ?? "#7a1f2b";
  const secondary = swatch[1] ?? darken(primary, 0.22);
  const accent = swatch[2] ?? deriveAccent(primary);

  return {
    primary,
    secondary,
    accent,
    pageWell: "#fbf5e9",
    // Cover title/subtitle text needs to flip to dark ink on pale templates
    // (Minimal, Rustic Ivory, etc.) or it becomes unreadable — this used to
    // be hardcoded to the cream pageWell color, which only worked for dark
    // covers.
    coverText: contrastText(primary),
  };
}

export default function TemplateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const [query, setQuery] = useState("");
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const filtered = query.trim()
    ? templates.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : templates;

  function updateEdgeState() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  useEffect(() => {
    updateEdgeState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdgeState, { passive: true });
    return () => el.removeEventListener("scroll", updateEdgeState);
  }, [filtered.length]);

  // Keep the selected template scrolled into view when it changes externally
  useEffect(() => {
    const el = cardRefs.current[value];
    el?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [value]);

  function scrollByAmount(direction: "left" | "right") {
    const container = trackRef.current;
    if (!container) return;
    const amount = direction === "left" ? -CARD_WIDTH * 1.4 : CARD_WIDTH * 1.4;
    container.scrollBy({ left: amount, behavior: "smooth" });
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    const container = trackRef.current;
    if (!container) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      container.scrollLeft += event.deltaY * 0.9;
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByAmount("right");
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByAmount("left");
    }
  }

  // Mouse drag-to-scroll (desktop convenience, in addition to wheel/touch)
  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    const container = trackRef.current;
    if (!container) return;
    isDragging.current = true;
    dragStartX.current = event.pageX;
    dragStartScroll.current = container.scrollLeft;
    container.classList.add("cursor-grabbing");
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const container = trackRef.current;
    if (!container) return;
    const delta = event.pageX - dragStartX.current;
    container.scrollLeft = dragStartScroll.current - delta;
  }

  function stopDragging() {
    isDragging.current = false;
    trackRef.current?.classList.remove("cursor-grabbing");
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Search / filter */}
      <div className="relative w-full max-w-xs lg:ml-12">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          name="template-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates..."
          className="w-full rounded-md border border-white/70 bg-white/80 py-1.5 pl-9 pr-3 text-sm text-stone-700 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-[#1e98d7]/50 focus:ring-2 focus:ring-[#1e98d7]/20"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          disabled={atStart}
          aria-label="Scroll templates left"
          className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/70 bg-white/85 text-stone-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/85 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="relative min-w-0 flex-1 w-[calc(10vw-4.5rem)]">
          {/* Edge fade cues */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[var(--fade-bg,rgba(255,255,255,0.9))] to-transparent transition-opacity ${
              atStart ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[var(--fade-bg,rgba(255,255,255,0.9))] to-transparent transition-opacity ${
              atEnd ? "opacity-0" : "opacity-100"
            }`}
          />

          <div
            ref={trackRef}
            role="listbox"
            tabIndex={0}
            aria-label="Template options"
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            className="flex cursor-grab touch-pan-x gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x proximity" }}
          >
            {filtered.length === 0 && (
              <p className="py-6 text-sm text-stone-400">No templates match &ldquo;{query}&rdquo;.</p>
            )}
            {filtered.map((t) => (
              <button
                key={t.id}
                ref={(el) => {
                  cardRefs.current[t.id] = el;
                }}
                type="button"
                role="option"
                aria-selected={value === t.id}
                onClick={() => onChange(t.id)}
                style={{ scrollSnapAlign: "start" }}
                className={`relative flex-none text-left rounded-md border-2 p-3 backdrop-blur-md transition-all active:scale-[0.98] ${
                  value === t.id
                    ? "border-[#1e98d7] ring-2 ring-[#1e98d7]/20 shadow-md bg-white/95"
                    : "border-white/70 bg-white/70 hover:border-[#1e98d7]/30 hover:bg-white/90 hover:shadow-sm"
                } w-[220px]`}
              >
                {value === t.id && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1e98d7] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div className="mb-3 flex gap-1">
                  {t.swatch.map((c) => (
                    <span
                      key={c}
                      className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-stone-800">{t.name}</p>
                <p className="mt-1 text-xs leading-snug text-stone-500">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          disabled={atEnd}
          aria-label="Scroll templates right"
          className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/70 bg-white/85 text-stone-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/85 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-stone-500 lg:pl-12">
        {filtered.length} of {templates.length} templates
      </p>
    </div>
  );
}