import { useId } from "react";
import type { SVGProps } from "react";

/* Shared by Ledger, Nocturne, Bloom, Bauhaus and Deco templates.
   Icons use stroke="currentColor", so Tailwind text-* classes recolor them. */

export type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export const MailIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
  </svg>
);
export const PhoneIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const PinIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const LinkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
);
export const UserIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1-4 4-6 8-6s7 2 8 6" />
  </svg>
);
export const BriefcaseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18" />
  </svg>
);
export const CapIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m2 9 10-5 10 5-10 5L2 9Z" />
    <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
  </svg>
);
export const BoltIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />
  </svg>
);
export const BadgeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="m9 14-1.5 7 4.5-2.5 4.5 2.5L15 14" />
  </svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

/** Picks an icon from what a contact string looks like. */
export function contactIcon(value: string) {
  const v = value.trim().toLowerCase();
  if (v.includes("@")) return MailIcon;
  if (/^(https?:|www\.)|linkedin|github|portfolio|\.(com|in|io|dev|net)(\/|$)/.test(v)) return LinkIcon;
  if (/^[+()\d][\d\s()+-]{6,}$/.test(v)) return PhoneIcon;
  return PinIcon;
}

/** Up to two initials, e.g. "Ranjeet Sharma" -> "RS". */
export function getInitials(name?: string, fallback = "Y") {
  const letters = (name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return letters || fallback;
}

/** Unique, url(#...)-safe id prefix so several templates can share one page. */
export function useUid() {
  return useId().replace(/:/g, "");
}
