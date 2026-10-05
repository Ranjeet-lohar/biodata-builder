"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// react-pdf needs the pdf.js worker. Match the version to your installed
// pdfjs-dist (`npm ls pdfjs-dist`) if this ever drifts out of sync.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface FlipbookTheme {
  /** Cover gradient start (top) — also used for the "page X of Y" text. */
  primary: string;
  /** Cover gradient end (bottom) — the darker shade of the spine. */
  secondary: string;
  /** Gold/foil accent — subtitle text, control-button borders. */
  accent: string;
  /** Background of the inner "page well" the PDF sits in. Usually a cream/paper tone. */
  pageWell: string;
  /**
   * Color for the cover title/subtitle text. Optional so themes built before
   * this field existed still work — falls back to `pageWell`, which is
   * correct for dark covers but wrong for light/pastel ones (e.g. a Minimal
   * or Rustic Ivory template), so themes built from
   * `templateToFlipbookTheme` should always supply it.
   */
  coverText?: string;
}

const DEFAULT_THEME: FlipbookTheme = {
  primary: "#7a1f2b",
  secondary: "#5c1620",
  accent: "#b08d57",
  pageWell: "#fbf5e9",
  coverText: "#fbf5e9",
};

interface HeaderPage {
  title: string;
  subtitle?: string;
  description?: string;
  /** Any valid CSS color for the cover background. Defaults to theme.primary. */
  accentColor?: string;
}

interface PdfFlipbookViewerProps {
  /** URL or object URL of the PDF to display (e.g. from your jsPDF export). */
  fileUrl: string;
  /** Optional label shown above the book, e.g. the person's name. */
  title?: string;
  /** Optional cover leaf rendered as the book's first page, before the PDF pages. */
  headerPage?: HeaderPage;
  /** Aspect ratio of a single page. Defaults to A4 portrait. */
  pageAspectRatio?: number; // width / height
  /** Color theme for the book. Defaults to the original maroon/gold look. */
  theme?: FlipbookTheme;
}

const A4_RATIO = 210 / 297;

export default function PdfFlipbookViewer({
  fileUrl,
  title,
  headerPage,
  pageAspectRatio = A4_RATIO,
  theme = DEFAULT_THEME,
}: PdfFlipbookViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPortraitMode, setIsPortraitMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);

  // Measure the fullscreen staging area so the book uses all available space
  // without exceeding either the viewport height or page-flip limits.
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = containerRef.current.offsetHeight;
        setContainerWidth(w);
        setContainerHeight(h);
        setIsPortraitMode(w < 640);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n);
      setIsReady(true);
    },
    []
  );

  const goPrev = () => flipBookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => flipBookRef.current?.pageFlip()?.flipNext();

  // Fit the page to both the available width and height. The flipbook shows
  // two pages on wide screens and one page in portrait mode.
  const maxSpreadWidth = 1240;
  const spreadWidth = Math.min(containerWidth, maxSpreadWidth);
  const maxPageHeight = Math.max(280, containerHeight - 64);
  const widthByHeight = maxPageHeight * pageAspectRatio;
  const pageWidth = Math.max(
    200,
    Math.min(
      isPortraitMode ? spreadWidth - 24 : spreadWidth / 2 - 8,
      widthByHeight,
      600
    )
  );
  const pageHeight = pageWidth / pageAspectRatio;

  const totalLeaves = (numPages ?? 0) + (headerPage ? 1 : 0);

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center">
      {title && (
        <p
          className="mb-1 shrink-0 text-sm tracking-wide font-serif italic sm:mb-2"
          style={{ color: theme.accent }}
        >
          {title}
        </p>
      )}

      {/* Staging area: warm radial glow + soft vignette behind the book,
          so it reads as sitting in ambient light rather than on flat
          white/transparent background. */}
      <div
        ref={containerRef}
        className="relative flex min-h-0 w-full max-w-none flex-1 items-center justify-center overflow-hidden py-2"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${theme.accent}22 0%, rgba(0,0,0,0) 70%)`,
          }}
        />

        {/* Book shadow / stand */}
        <div className="absolute bottom-1 left-1/2 h-6 w-[85%] -translate-x-1/2 rounded-full bg-[#3d2b1f]/25 blur-lg" />

        {/* Ribbon bookmark — purely ornamental, hangs from the spine */}
        <div
          className="absolute top-0 left-1/2 z-30 h-10 w-3 -translate-x-1/2"
          style={{
            background: `linear-gradient(to bottom, ${theme.accent}, ${theme.accent}cc)`,
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        />

        <div
          className="relative max-h-full max-w-full overflow-hidden rounded-[8px] p-2 shadow-[0_18px_40px_-12px_rgba(61,43,31,0.55)] sm:p-3"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${theme.primary}, ${theme.secondary})`,
          }}
        >
          {/* Leather-grain texture overlay — a fine repeating diagonal
              pattern so the cover reads as tooled leather rather than a
              flat gradient fill. Kept very low-opacity so it textures
              without muddying the theme colors. */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 4px)",
            }}
          />

          {/* Inner "page well" — cream backing so the leather cover reads as
              a frame around bound paper, not a border around blank white. */}
          <div
            className="relative rounded-[4px] p-1.5 sm:p-2"
            style={{ backgroundColor: theme.pageWell }}
          >
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div
                  style={{
                    width: isPortraitMode ? pageWidth : pageWidth * 2,
                    height: pageHeight,
                    color: theme.primary,
                  }}
                  className="flex items-center justify-center text-sm font-serif"
                >
                  Opening the biodata…
                </div>
              }
              error={
                <div
                  style={{
                    width: isPortraitMode ? pageWidth : pageWidth * 2,
                    height: pageHeight,
                    color: theme.primary,
                  }}
                  className="flex items-center justify-center text-center px-6 text-sm"
                >
                  Couldn&apos;t open this PDF. Double-check the file and try
                  again.
                </div>
              }
            >
              {isReady && numPages && pageWidth > 0 && (
                <div className="relative">
                  {!isPortraitMode && (
                    <div
                      className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 z-10"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(61,43,31,0.18) 40%, rgba(61,43,31,0.28) 50%, rgba(61,43,31,0.18) 60%, rgba(0,0,0,0) 100%)",
                      }}
                    />
                  )}

                  {/* @ts-ignore -- react-pageflip's types lag its runtime API */}
                  <HTMLFlipBook
                    ref={flipBookRef}
                    width={pageWidth}
                    height={pageHeight}
                    size="fixed"
                    minWidth={200}
                    maxWidth={600}
                    minHeight={280}
                    maxHeight={900}
                    showCover={!!headerPage}
                    usePortrait={isPortraitMode}
                    drawShadow
                    maxShadowOpacity={0.55}
                    mobileScrollSupport
                    onFlip={(e: { data: number }) => setCurrentPage(e.data)}
                    className="drop-shadow-md"
                  >
                    {headerPage && (
                      <div
                        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 py-8 text-center shadow-[inset_-10px_0_18px_-14px_rgba(0,0,0,0.5)] sm:px-8"
                        style={{
                          background: `linear-gradient(145deg, ${headerPage.accentColor ?? theme.primary} 0%, ${theme.primary} 52%, ${theme.secondary} 100%)`,
                        }}
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 300 420"
                          preserveAspectRatio="none"
                          className="pointer-events-none absolute inset-0 h-full w-full"
                        >
                          <rect
                            x="12"
                            y="12"
                            width="276"
                            height="396"
                            rx="3"
                            fill="none"
                            stroke={theme.accent}
                            strokeOpacity="0.65"
                            strokeWidth="1"
                          />
                          <rect
                            x="18"
                            y="18"
                            width="264"
                            height="384"
                            rx="2"
                            fill="none"
                            stroke={theme.accent}
                            strokeOpacity="0.28"
                            strokeWidth="0.7"
                          />
                          <path
                            d="M24 92 C56 92 69 73 69 42 M24 92 C24 60 43 47 69 42 M276 92 C244 92 231 73 231 42 M276 92 C276 60 257 47 231 42 M24 328 C56 328 69 347 69 378 M24 328 C24 360 43 373 69 378 M276 328 C244 328 231 347 231 378 M276 328 C276 360 257 373 231 378"
                            fill="none"
                            stroke={theme.accent}
                            strokeOpacity="0.8"
                            strokeWidth="1.3"
                          />
                          <path
                            d="M150 80 C132 96 132 110 150 124 C168 110 168 96 150 80 Z M150 340 C132 324 132 310 150 296 C168 310 168 324 150 340 Z M139 102 H161 M139 318 H161"
                            fill="none"
                            stroke={theme.accent}
                            strokeOpacity="0.75"
                            strokeWidth="1"
                          />
                          <circle cx="150" cy="102" r="3" fill={theme.accent} />
                          <circle cx="150" cy="318" r="3" fill={theme.accent} />
                        </svg>

                        <div className="relative z-10 flex w-full max-w-full flex-col items-center">
                          <div
                            aria-hidden="true"
                            className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border"
                            style={{
                              borderColor: `${theme.accent}cc`,
                              color: theme.accent,
                              backgroundColor: "rgba(0,0,0,0.12)",
                            }}
                          >
                            <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none">
                              <path
                                d="M16 3.5 18.7 12l8.8.1-7.1 5.2 2.7 8.5-7.1-5.3-7.1 5.3 2.7-8.5-7.1-5.2 8.8-.1L16 3.5Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinejoin="round"
                              />
                              <circle cx="16" cy="16" r="2.5" fill="currentColor" />
                            </svg>
                          </div>
                          <h2
                            className="mb-3 max-w-full break-words font-serif text-xl font-semibold leading-tight sm:text-3xl"
                            style={{
                              color: theme.coverText ?? theme.pageWell,
                              textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                            }}
                          >
                            {headerPage.title}
                          </h2>
                          {headerPage.subtitle && (
                            <p
                              className="mb-4 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm"
                              style={{
                                color: theme.coverText ?? theme.pageWell,
                                borderColor: `${theme.accent}cc`,
                                backgroundColor: "rgba(0,0,0,0.18)",
                              }}
                            >
                              {headerPage.subtitle}
                            </p>
                          )}
                          {headerPage.description && (
                            <p
                              className="max-w-[18rem] break-words text-xs leading-relaxed sm:text-sm"
                              style={{
                                color: theme.coverText ?? theme.pageWell,
                                textShadow: "0 1px 5px rgba(0,0,0,0.4)",
                              }}
                            >
                              {headerPage.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {Array.from({ length: numPages }, (_, i) => (
                      <div
                        key={i}
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{
                          backgroundColor: theme.pageWell,
                          boxShadow:
                            i % 2 === 0
                              ? "inset -12px 0 20px -16px rgba(0,0,0,0.35)"
                              : "inset 12px 0 20px -16px rgba(0,0,0,0.35)",
                        }}
                      >
                        {/* Gilded page edge — a thin gold-gradient stripe
                            along the outer edge, mimicking gilt-edged
                            paper on a keepsake album. */}
                        <div
                          className="absolute top-0 bottom-0 w-[3px] z-20"
                          style={{
                            [i % 2 === 0 ? "right" : "left"]: 0,
                            background: `linear-gradient(to bottom, ${theme.accent}, #f5e3b8, ${theme.accent})`,
                          } as React.CSSProperties}
                        />
                        <Page
                          pageNumber={i + 1}
                          width={pageWidth}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>
              )}
            </Document>
          </div>
        </div>
      </div>

      {/* Controls: bookmark-ribbon style page indicator + turn buttons */}
      {numPages && (
        <div className="mt-2 flex shrink-0 items-center gap-5 pb-1 sm:mt-3">
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            aria-label="Previous page"
            style={{ borderColor: theme.accent, color: theme.primary }}
            className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#b08d57]/10 transition-colors"
          >
            ‹
          </button>

          <span
            className="font-serif text-sm tabular-nums tracking-widest"
            style={{ color: theme.secondary }}
          >
            {currentPage + 1} / {totalLeaves}
          </span>

          <button
            onClick={goNext}
            disabled={currentPage >= totalLeaves - 1}
            aria-label="Next page"
            style={{ borderColor: theme.accent, color: theme.primary }}
            className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#b08d57]/10 transition-colors"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}