import { Theme } from "./theme";

export function CornerMotif({
  theme,
  className = "",
}: {
  theme: Theme;
  className?: string;
}) {
  if (theme.corner === "none") return null;

  if (theme.corner === "dots") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) =>
            row + col < 4 ? (
              <circle
                key={`${row}-${col}`}
                cx={12 + col * 14}
                cy={12 + row * 14}
                r={2.4}
                fill={theme.primary}
                opacity={1 - (row + col) * 0.18}
              />
            ) : null
          )
        )}
      </svg>
    );
  }

  if (theme.corner === "diamonds") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        <path d="M10 10 L18 2 L26 10 L18 18 Z" fill={theme.primary} opacity="0.9" />
        <path d="M28 10 L34 4 L40 10 L34 16 Z" fill={theme.primary} opacity="0.6" />
        <path d="M10 28 L16 22 L22 28 L16 34 Z" fill={theme.primary} opacity="0.6" />
        <path d="M2 40 L44 40" stroke={theme.primary} strokeWidth="1.5" opacity="0.5" />
        <path d="M40 2 L40 44" stroke={theme.primary} strokeWidth="1.5" opacity="0.5" />
      </svg>
    );
  }

  // paisley
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M4 4C40 8 80 16 96 40C110 60 112 90 116 116" stroke={theme.primary} strokeWidth="2" />
      <path d="M4 4C10 30 18 60 34 82C50 104 76 112 116 116" stroke={theme.primary} strokeWidth="1" opacity="0.6" />
      <circle cx="4" cy="4" r="4" fill={theme.primary} />
      <circle cx="30" cy="14" r="2.5" fill={theme.primary} />
      <circle cx="14" cy="30" r="2.5" fill={theme.primary} />
    </svg>
  );
}

export function photoShapeClass(shape: Theme["photoShape"]) {
  if (shape === "circle") return "rounded-xl";
  if (shape === "rounded") return "rounded-2xl";
  return "rounded-none";
}
