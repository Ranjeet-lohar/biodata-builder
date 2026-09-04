"use client";

import { useEffect, useRef, useState } from "react";
import { templates } from "./templates";
import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react";

const CARD_WIDTH = 220;

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
      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
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

      <p className="text-xs text-stone-400">
        {filtered.length} of {templates.length} templates
      </p>
    </div>
  );
}