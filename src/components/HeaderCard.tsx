"use client";

import { BiodataDocument, invocationPresets } from "@/lib/types";
import PhotoUpload from "./PhotoUpload";
import { TextField } from "./Field";
import { Sparkles, Flower2, Camera } from "lucide-react";

export default function HeaderCard({
  doc,
  onChange,
}: {
  doc: BiodataDocument;
  onChange: (patch: Partial<BiodataDocument>) => void;
}) {
  return (
    <div
      className="
        relative overflow-hidden
        rounded
        border border-[#e8dfd1]
        bg-[#fffdf8]/90
        p-5
        shadow-[0_18px_60px_rgba(92,68,42,0.08)]
        backdrop-blur-xl
      "
    >
      {/* Floral background glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-amber-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-violet-200/20 blur-3xl" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-rose-100
                  via-amber-50
                  to-orange-100
                  text-rose-500
                  shadow-sm
                "
              >
                <Flower2 className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-wide text-stone-800">
                  Personal Details
                </h3>

                <p className="text-[11px] text-stone-400">
                  Photo, name & invocation
                </p>
              </div>
            </div>
          </div>

          <span
            className="
              rounded-full
              border border-amber-200/70
              bg-amber-50/70
              px-2.5 py-1
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-amber-700
            "
          >
            Profile
          </span>
        </div>

        {/* Photo */}
        <div className="group relative overflow-hidden rounded border border-white/60 p-4 sm:p-5 shadow-sm shadow-stone-900/5 transition-shadow hover:shadow-md hover:shadow-stone-900/10">
          {/* animated gradient layer */}
          <div className="absolute inset-0 -z-10 animate-gradient-shift bg-[length:200%_200%] bg-gradient-to-br from-rose-50 via-white to-amber-50" />
          {/* glass overlay on top of the gradient so content stays readable */}
          <div className="absolute inset-0 -z-10 bg-white/50 backdrop-blur-xl" />

          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-200/70">
              <Camera className="h-3.5 w-3.5 text-rose-500" strokeWidth={2.5} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
              Profile Photo
            </p>
          </div>

          <PhotoUpload
            value={doc.photo}
            onChange={(v) => onChange({ photo: v })}
          />
        </div>

        {/* Name */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Name
            </span>

            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label="Full Name (English)"
              value={doc.fullName}
              onChange={(v) => onChange({ fullName: v })}
              placeholder="e.g. Ananya Sharma"
            />

            <TextField
              label="Full Name (Hindi) — optional"
              value={doc.fullNameHi}
              onChange={(v) => onChange({ fullNameHi: v })}
              placeholder="जैसे अनन्या शर्मा"
            />
          </div>
        </div>

        {/* Invocation */}
        <div
          className="
            relative overflow-hidden
            rounded
            border border-amber-200/70
            bg-gradient-to-br
            from-amber-50/80
            via-white/60
            to-rose-50/60
            p-4
          "
        >
          {/* Decorative corner */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full border border-amber-300/30" />
          <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full border border-rose-300/20" />

          <label className="flex cursor-pointer items-start gap-3">
            <span className="relative mt-0.5 inline-flex h-4 w-4 shrink-0">
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
                  cursor-pointer
                  appearance-none
                  rounded
                  border border-stone-300
                  bg-white
                  shadow-sm
                  transition-colors duration-150
                  hover:border-amber-400
                  checked:border-amber-500
                  checked:bg-amber-500
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-amber-200
                  focus-visible:ring-offset-1
                "
              />

              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="
                  pointer-events-none
                  absolute inset-0
                  h-4 w-4
                  scale-50 opacity-0
                  text-white
                  transition-all duration-150 ease-out
                  peer-checked:scale-100 peer-checked:opacity-100
                "
              >
                <path
                  d="M3.5 8.5L6.5 11.5L12.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="flex flex-1 items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

              <span>
                <span className="block text-sm font-semibold text-stone-800">
                  Show invocation header
                </span>

                <span className="mt-0.5 block text-[11px] leading-relaxed text-stone-500">
                  Add an auspicious opening such as{" "}
                  <span className="font-medium text-stone-700">
                    श्री गणेशाय नमः
                  </span>
                </span>
              </span>
            </span>
          </label>

          {doc.invocation.enabled && (
            <div className="mt-4 space-y-4 border-t border-amber-200/60 pt-4">
              {/* Presets */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">
                  Choose a preset
                </p>

                <div className="flex flex-wrap gap-2">
                  {invocationPresets.map((p) => {
                    const active = doc.invocation.text === p;

                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() =>
                          onChange({
                            invocation: {
                              ...doc.invocation,
                              text: p,
                            },
                          })
                        }
                        className={`
                          group
                          relative
                          overflow-hidden
                          rounded-full
                          border
                          px-3.5 py-1.5
                          text-xs
                          font-medium
                          transition-all
                          duration-200
                          ${
                            active
                              ? "border-amber-400 bg-gradient-to-r from-amber-100 to-rose-100 text-amber-800 shadow-sm"
                              : "border-stone-200 bg-white/70 text-stone-600 hover:border-amber-300 hover:bg-amber-50/70"
                          }
                        `}
                      >
                        {active && (
                          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                        )}

                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom text */}
              <div className="border border-white/80 bg-white/60">
                <TextField
                  label="Custom invocation text"
                  value={doc.invocation.text}
                  onChange={(v) =>
                    onChange({
                      invocation: {
                        ...doc.invocation,
                        text: v,
                      },
                    })
                  }
                  placeholder="Type your own line…"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}