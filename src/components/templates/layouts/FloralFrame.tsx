import { Theme } from "./theme";

export default function FloralFrame({ theme }: { theme: Theme }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 794 1123"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Corner brackets — top left */}
      <path
        d="M 40 96 L 40 40 L 96 40"
        fill="none"
        stroke={theme.primary}
        strokeWidth="1"
      />
      {/* Corner brackets — top right */}
      <path
        d="M 698 40 L 754 40 L 754 96"
        fill="none"
        stroke={theme.primary}
        strokeWidth="1"
      />
      {/* Corner brackets — bottom left */}
      <path
        d="M 40 1027 L 40 1083 L 96 1083"
        fill="none"
        stroke={theme.primary}
        strokeWidth="1"
      />
      {/* Corner brackets — bottom right */}
      <path
        d="M 698 1083 L 754 1083 L 754 1027"
        fill="none"
        stroke={theme.primary}
        strokeWidth="1"
      />

      {/* Faint secondary tick, offset inward from each bracket, echoing a double-rule border */}
      <path
        d="M 52 96 L 52 52 L 96 52"
        fill="none"
        stroke={theme.border}
        strokeWidth="0.75"
        opacity="0.6"
      />
      <path
        d="M 698 52 L 742 52 L 742 96"
        fill="none"
        stroke={theme.border}
        strokeWidth="0.75"
        opacity="0.6"
      />
      <path
        d="M 52 1027 L 52 1071 L 96 1071"
        fill="none"
        stroke={theme.border}
        strokeWidth="0.75"
        opacity="0.6"
      />
      <path
        d="M 698 1071 L 742 1071 L 742 1027"
        fill="none"
        stroke={theme.border}
        strokeWidth="0.75"
        opacity="0.6"
      />
    </svg>
  );
}
