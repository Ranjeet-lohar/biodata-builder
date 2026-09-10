"use client";

import { BiodataDocument, invocationPresets } from "@/lib/types";
import PhotoUpload from "./PhotoUpload";
import { TextField } from "./Field";
import {
  Sparkles,
  Flower2,
  Check,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function HeaderCard({
  doc,
  onChange,
}: {
  doc: BiodataDocument;
  onChange: (patch: Partial<BiodataDocument>) => void;
}) {
  const [showInvocation, setShowInvocation] = useState(
    doc.invocation.enabled
  );

  function toggleInvocation() {
    const next = !doc.invocation.enabled;

    onChange({
      invocation: {
        ...doc.invocation,
        enabled: next,
      },
    });

    setShowInvocation(next);
  }

  return (
    <section className="overflow-hidden rounded border border-stone-200 bg-white">
      {/* ───────────────── Header ───────────────── */}
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
            <Flower2 className="h-3.5 w-3.5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold leading-none text-stone-900">
              Personal Details
            </h3>

            <p className="mt-1 text-[10px] text-stone-400">
              Profile information
            </p>
          </div>
        </div>

        <span className="rounded-full bg-stone-100 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-stone-500">
          01
        </span>
      </div>

      {/* ───────────────── Main Content ───────────────── */}
      <div className="p-4 sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-start">
          {/* Photo */}
          <div className="shrink-0">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-stone-400">
                Photo
              </span>

              <span className="h-1 w-1 rounded-full bg-stone-300" />
            </div>

            <PhotoUpload
              value={doc.photo}
              onChange={(v) => onChange({ photo: v })}
            />
          </div>

          {/* Name Fields */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-stone-400">
                Name
              </span>

              <span className="h-px flex-1 bg-stone-100" />
            </div>

            <div className="grid g gap-[3px] grid-cols-1">
              <TextField
                label=""
                value={doc.fullName}
                onChange={(v) => onChange({ fullName: v })}
                placeholder="e.g. Ananya Sharma"
              />

              <TextField
                label=""
                value={doc.fullNameHi}
                onChange={(v) => onChange({ fullNameHi: v })}
                placeholder="जैसे अनन्या शर्मा"
              />
            </div>

            {/* Small helper */}
            <p className="mt-2 text-[10px] text-stone-400">
              Your name will appear prominently on the biodata.
            </p>
          </div>
        </div>

        {/* ───────────────── Invocation Feature ───────────────── */}
        <div className="mt-5 border-t border-stone-100 pt-4">
          <button
            type="button"
            onClick={toggleInvocation}
            aria-expanded={showInvocation}
            className="
              group
              flex w-full
              items-center
              justify-between
              rounded-md
              border border-stone-200
              px-3.5 py-3
              text-left
              transition-colors
              hover:border-stone-300
              hover:bg-stone-50
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-stone-400
              focus-visible:ring-offset-1
            "
          >
            <span className="flex min-w-0 items-center gap-3">
              <span
                className={`
                  flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-lg
                  transition-colors
                  ${
                    doc.invocation.enabled
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-500"
                  }
                `}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </span>

              <span className="min-w-0">
                <span className="block text-xs font-semibold text-stone-800">
                  Invocation Header
                </span>

                <span className="mt-0.5 block truncate text-[10px] text-stone-400">
                  {doc.invocation.enabled
                    ? doc.invocation.text || "Custom invocation"
                    : "Add an auspicious opening"}
                </span>
              </span>
            </span>

            <span className="ml-3 flex shrink-0 items-center gap-2">
              {doc.invocation.enabled && (
                <span className="hidden items-center gap-1 rounded-full bg-stone-100 px-2 py-1 text-[9px] font-semibold text-stone-600 sm:flex">
                  <Check className="h-2.5 w-2.5" />
                  Active
                </span>
              )}

              <ChevronDown
                className={`
                  h-4 w-4 text-stone-400
                  transition-transform duration-200
                  ${showInvocation ? "rotate-180" : ""}
                `}
              />
            </span>
          </button>

          {/* Invocation Panel */}
          {showInvocation && (
            <div className="mt-3 rounded-md bg-stone-50 p-3.5" style={{
      backgroundColor: "#e8ecf1",
      boxShadow:
        "inset 2px 2px 5px rgba(163,177,198,0.5), inset -2px -2px 5px rgba(255,255,255,0.7)",
    }}>
              {/* Enable */}
              <label className="mb-3 flex cursor-pointer items-center gap-2.5">
                <span className="relative flex h-4 w-4 shrink-0">
                  <input
                    type="checkbox"
                    checked={doc.invocation.enabled}
                    onChange={(e) =>
                      onChange({
                        invocation: {
                          ...doc.invocation,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="
                      peer
                      h-4 w-4
                      appearance-none
                      rounded
                      border border-stone-300
                      bg-white
                      transition
                      checked:border-stone-900
                      checked:bg-stone-900
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-stone-400
                    "
                  />

                  <Check
                    className="
                      pointer-events-none
                      absolute inset-0
                      h-4 w-4
                      scale-50
                      text-white
                      opacity-0
                      transition
                      peer-checked:scale-100
                      peer-checked:opacity-100
                    "
                  />
                </span>

                <span className="text-xs font-medium text-stone-700">
                  Show invocation on biodata
                </span>
              </label>

              {doc.invocation.enabled && (
                <>
                 {/* Presets */}
<div className="mb-3">
  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-stone-400">
    Quick Select
  </p>

  <div
    className="flex flex-wrap gap-2.5 rounded p-3"
    
  >
    {invocationPresets.map((preset) => {
      const active = doc.invocation.text === preset;

      return (
        <button
  key={preset}
  type="button"
  onClick={() =>
    onChange({
      invocation: {
        ...doc.invocation,
        text: preset,
      },
    })
  }
  className="inline-flex outline-none items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-all duration-200 focus:outline-none"
  style={{
    backgroundColor: active ? "#eef2ff" : "#e8ecf1",
    color: active ? "#4f46e5" : "#6b7280",
    boxShadow: active
      ? "inset 2px 2px 5px rgba(79,70,229,0.25), inset -2px -2px 5px rgba(255,255,255,0.9)"
      : "3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.8)",
  }}
  onMouseDown={(e) => {
    e.currentTarget.style.boxShadow = active
      ? "inset 3px 3px 6px rgba(79,70,229,0.3), inset -3px -3px 6px rgba(255,255,255,0.9)"
      : "inset 2px 2px 4px rgba(163,177,198,0.6), inset -2px -2px 4px rgba(255,255,255,0.8)";
  }}
  onMouseUp={(e) => {
    e.currentTarget.style.boxShadow = active
      ? "inset 2px 2px 5px rgba(79,70,229,0.25), inset -2px -2px 5px rgba(255,255,255,0.9)"
      : "3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.8)";
  }}
>
  {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
  {preset}
</button>
      );
    })}
  </div>
</div>

                  {/* Custom */}
                  <TextField
                    label="Custom invocation"
                    value={doc.invocation.text}
                    onChange={(v) =>
                      onChange({
                        invocation: {
                          ...doc.invocation,
                          text: v,
                        },
                      })
                    }
                    placeholder="श्री गणेशाय नमः"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
