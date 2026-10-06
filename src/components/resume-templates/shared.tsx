import type { CSSProperties, ReactNode } from "react";
import type { ResumeDocument } from "@/lib/resumeTypes";

export interface ResumeTemplateDesignProps {
  resume: ResumeDocument;
  contact: string[];
  skills: string[];
  certifications: string[];
  experienceEntries: ReactNode;
  educationEntries: ReactNode;
  headingStyle: CSSProperties;
  ink: string;
  muted: string;
  accent: string;
  hasValue: (value: string) => boolean;
}

type PatternStyle =
  | "mandala"
  | "leaves"
  | "diamonds"
  | "arches"
  | "rays"
  | "waves"
  | "dots"
  | "grid"
  | "triangles";

/* ---------- Generated geometry (computed once, identical on every render) ---------- */
const WAVE_LINES = Array.from({ length: 14 }, (_, i) => {
  const y = 40 + i * 78;
  return `M0 ${y} C160 ${y - 40} 300 ${y + 40} 460 ${y} S700 ${y - 36} 794 ${y + 8}`;
});

const DOTS = Array.from({ length: 46 * 33 }, (_, n) => ({
  cx: (n % 33) * 24 + 12,
  cy: Math.floor(n / 33) * 24 + 12,
}));

const TRIANGLES = Array.from({ length: 22 * 16 }, (_, n) => {
  const row = Math.floor(n / 16);
  const col = n % 16;
  return `M${col * 52 + (row % 2) * 26} ${row * 52 + 52} l26 -44 l26 44 Z`;
});

/**
 * Decorative background pattern.
 * - Plain strokes and shapes only: no gradients, masks, clip paths or ids,
 *   so it is safe for html2canvas / PDF export and for several previews on one page.
 * - `opacity` overrides each variant's default strength.
 * - `preserveAspectRatio` defaults to "none" (stretches to the box, as before).
 *   Pass "xMidYMid slice" to keep shapes undistorted in non-A4 boxes.
 */
export function SvgPattern({
  variant,
  color,
  className = "",
  opacity,
  preserveAspectRatio = "none",
}: {
  variant: PatternStyle;
  color: string;
  className?: string;
  opacity?: number;
  preserveAspectRatio?: string;
}) {
  const o = (fallback: number) => opacity ?? fallback;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 794 1123"
      preserveAspectRatio={preserveAspectRatio}
      className={`pointer-events-none absolute ${className}`}
      fill="none"
    >
      {variant === "mandala" && (
        <g transform="translate(690 110)" stroke={color} opacity={o(0.18)}>
          <circle r="36" strokeWidth="1.5" />
          <circle r="58" strokeWidth="1" />
          <circle r="82" strokeWidth="0.8" strokeDasharray="2 5" />
          {Array.from({ length: 12 }, (_, index) => (
            <ellipse key={index} cy="-51" rx="8" ry="20" transform={`rotate(${index * 30})`} />
          ))}
        </g>
      )}

      {variant === "leaves" && (
        <g stroke={color} strokeWidth="1.5" opacity={o(0.18)}>
          {Array.from({ length: 7 }, (_, index) => (
            <g key={index} transform={`translate(34 ${80 + index * 112})`}>
              <path d="M0 0 C38 16 50 46 54 82" />
              <path d="M14 20 C-2 4 -18 7 -22 22 C-9 34 3 31 14 20Z" />
              <path d="M34 48 C44 28 61 29 68 42 C61 58 48 61 34 48Z" />
              <path d="M49 72 C36 56 19 61 17 76 C27 89 41 86 49 72Z" />
            </g>
          ))}
        </g>
      )}

      {variant === "diamonds" && (
        <g stroke={color} strokeWidth="1" opacity={o(0.16)}>
          {Array.from({ length: 11 }, (_, row) =>
            Array.from({ length: 8 }, (_, column) => (
              <path
                key={`${row}-${column}`}
                d="M0 -17 L17 0 L0 17 L-17 0Z"
                transform={`translate(${28 + column * 108 + (row % 2) * 54} ${30 + row * 108})`}
              />
            )),
          )}
        </g>
      )}

      {variant === "arches" && (
        <g stroke={color} strokeWidth="2" opacity={o(0.16)}>
          {[0, 1, 2, 3].map((index) => (
            <path
              key={index}
              d={`M${80 + index * 28} 1123 V${360 + index * 28} A${240 - index * 28} ${240 - index * 28} 0 0 1 ${560 - index * 28} ${360 + index * 28} V1123`}
            />
          ))}
          <path d="M80 450H714M80 490H714" />
        </g>
      )}

      {variant === "rays" && (
        <g stroke={color} strokeWidth="1.5" opacity={o(0.16)}>
          <path d="M794 0L570 260M794 45L610 260M794 90L650 260M794 135L690 260M794 180L730 260" />
          <path d="M580 0V260M620 0V260M660 0V260M700 0V260M740 0V260" />
          <circle cx="680" cy="130" r="86" />
          <circle cx="680" cy="130" r="62" />
        </g>
      )}

      {/* ----- New variants ----- */}
      {variant === "waves" && (
        <g stroke={color} strokeWidth="1.2" opacity={o(0.14)}>
          {WAVE_LINES.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}

      {variant === "dots" && (
        <g fill={color} opacity={o(0.16)}>
          {DOTS.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r="1.5" />
          ))}
        </g>
      )}

      {variant === "grid" && (
        <g stroke={color} strokeWidth="0.8" opacity={o(0.12)}>
          {Array.from({ length: 33 }, (_, i) => (
            <path key={`v${i}`} d={`M${i * 24.8} 0V1123`} />
          ))}
          {Array.from({ length: 47 }, (_, i) => (
            <path key={`h${i}`} d={`M0 ${i * 24.5}H794`} />
          ))}
        </g>
      )}

      {variant === "triangles" && (
        <g stroke={color} strokeWidth="0.9" opacity={o(0.13)}>
          {TRIANGLES.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}

/* ---------- Shared icons (stroke-based, currentColor, no ids) ---------- */
const iconBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Icons = {
  profile: (s = 13) => (
    <svg width={s} height={s} {...iconBase}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" />
    </svg>
  ),
  experience: (s = 13) => (
    <svg width={s} height={s} {...iconBase}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7 V5 A1.5 1.5 0 0 1 10.5 3.5 H13.5 A1.5 1.5 0 0 1 15 5 V7" />
      <path d="M3 13 H21" />
    </svg>
  ),
  education: (s = 13) => (
    <svg width={s} height={s} {...iconBase}>
      <path d="M2 9 L12 4 L22 9 L12 14 Z" />
      <path d="M6 11.5 V16 C6 17.5 9 19 12 19 C15 19 18 17.5 18 16 V11.5" />
      <path d="M22 9 V15" />
    </svg>
  ),
  skills: (s = 13) => (
    <svg width={s} height={s} {...iconBase}>
      <path d="M12 3 L14.5 9.5 L21 12 L14.5 14.5 L12 21 L9.5 14.5 L3 12 L9.5 9.5 Z" />
    </svg>
  ),
  certification: (s = 13) => (
    <svg width={s} height={s} {...iconBase}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.6 9 L11.4 10.8 L14.6 7.4" />
      <path d="M8.5 13.8 L7 21 L12 18.5 L17 21 L15.5 13.8" />
    </svg>
  ),
  mail: (s = 11) => (
    <svg width={s} height={s} {...iconBase}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7 L12 13 L21 7" />
    </svg>
  ),
  phone: (s = 11) => (
    <svg width={s} height={s} {...iconBase}>
      <path d="M5 4 H9 L11 9 L8.5 10.5 C9.6 12.8 11.2 14.4 13.5 15.5 L15 13 L20 15 V19 C20 19.6 19.6 20 19 20 C10.7 19.5 4.5 13.3 4 5 C4 4.4 4.4 4 5 4 Z" />
    </svg>
  ),
  pin: (s = 11) => (
    <svg width={s} height={s} {...iconBase}>
      <path d="M12 21 C7 15 5 12 5 9 A7 7 0 0 1 19 9 C19 12 17 15 12 21 Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  globe: (s = 11) => (
    <svg width={s} height={s} {...iconBase}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12 H21" />
      <path d="M12 3 C15 6 15 18 12 21 C9 18 9 6 12 3 Z" />
    </svg>
  ),
};

/** Picks mail / globe / phone / pin from the text of a contact line. */
export function contactIcon(text: string, size = 11) {
  const t = text.toLowerCase();
  if (t.includes("@")) return Icons.mail(size);
  if (/(https?:\/\/|www\.|linkedin|github|behance|dribbble|\.com|\.in|\.org)/.test(t)) return Icons.globe(size);
  if (/^[+\d][\d\s().-]{6,}$/.test(text.trim())) return Icons.phone(size);
  return Icons.pin(size);
}

export function hasValue(value: string) {
  return value.trim().length > 0;
}