"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

export default function PhotoUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-28 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 overflow-hidden flex items-center justify-center shrink-0">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <ImagePlus className="w-6 h-6 text-stone-300" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-primary w-fit">
          {value ? "Change photo" : "Upload photo"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="btn-outline w-fit !py-1 !px-2.5 text-xs">
            <X className="w-3 h-3" /> Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
