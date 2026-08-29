"use client";

import { useRef } from "react";
import { templates } from "./templates";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const CARD_WIDTH = 220;

export default function TemplateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollByAmount("left")}
        aria-label="Scroll templates left"
        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/70 bg-white/85 text-stone-700 shadow-sm transition hover:bg-white sm:h-10 sm:w-10"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={trackRef}
        onWheel={handleWheel}
        className="flex min-w-0 flex-1 touch-pan-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
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

      <button
        type="button"
        onClick={() => scrollByAmount("right")}
        aria-label="Scroll templates right"
        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/70 bg-white/85 text-stone-700 shadow-sm transition hover:bg-white sm:h-10 sm:w-10"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
