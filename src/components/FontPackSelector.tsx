"use client";

import { fontPacks } from "@/lib/fontPacks";
import { Type } from "lucide-react";

export default function FontPackSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-1.5 text-sm border border-stone-300 rounded px-2.5 py-2 bg-white shadow-sm hover:border-stone-400 transition-colors">
      <Type className="w-3.5 h-3.5 text-stone-500 shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-stone-700 max-w-[140px] sm:max-w-none"
      >
        {fontPacks.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
    </label>
  );
}
