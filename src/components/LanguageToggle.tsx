"use client";

import { Language } from "@/lib/types";

export default function LanguageToggle({
  value,
  onChange,
}: {
  value: Language;
  onChange: (v: Language) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-stone-300 overflow-hidden text-sm shrink-0 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`px-3 py-2 transition-colors ${
          value === "en" ? "bg-stone-900 text-white" : "bg-white text-stone-700 hover:bg-stone-50"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("hi")}
        className={`px-3 py-2 transition-colors ${
          value === "hi" ? "bg-stone-900 text-white" : "bg-white text-stone-700 hover:bg-stone-50"
        }`}
      >
        हिं
      </button>
    </div>
  );
}
