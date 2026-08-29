"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({
  title,
  icon,
  defaultOpen,
  children,
}: {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-stone-800 text-sm">
          {icon}
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children}
        </div>
      )}
    </div>
  );
}
