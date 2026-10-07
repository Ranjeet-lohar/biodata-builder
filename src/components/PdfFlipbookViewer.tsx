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
    window.addEventListener("resize", measure);
    return () => {
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

  // Leave room for the leather frame and page well when fitting the book.
  // On narrow screens, switch to a single page and allow smaller leaves.
  const availablePageWidth = isPortraitMode
    ? containerWidth - 56
    : (containerWidth - 56) / 2;
  const maxPageHeight = Math.max(170, containerHeight - 48);
  const widthByHeight = maxPageHeight * pageAspectRatio;
  const minPageWidth = 120;
  const minPageHeight = Math.floor(minPageWidth / pageAspectRatio);
  const pageWidth = Math.max(
    minPageWidth,
    Math.min(availablePageWidth, widthByHeight, 600)
  );
  const pageHeight = pageWidth / pageAspectRatio;
  const isShortViewport = containerHeight > 0 && containerHeight < 360;

  const totalLeaves = (numPages ?? 0) + (headerPage ? 1 : 0);

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col items-center"
      style={{
        boxSizing: "border-box",
        paddingTop: "max(3.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {title && (
        <p
          className={`mb-1 shrink-0 text-sm tracking-wide font-serif italic sm:mb-2 ${isShortViewport ? "hidden" : ""
            }`}
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
              {isReady &&
                numPages &&
                containerWidth > 0 &&
                containerHeight > 0 &&
                pageWidth > 0 && (
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
                    minWidth={minPageWidth}
                    maxWidth={600}
                    minHeight={minPageHeight}
                    maxHeight={900}
                    showCover={!!headerPage}
                    usePortrait={isPortraitMode}
                    drawShadow
                    maxShadowOpacity={0.55}
                    mobileScrollSupport={false}
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
                          {/* Outer + inner borders */}
                          <rect
                            x="10" y="10" width="280" height="400" rx="2"
                            fill="none" stroke={theme.accent} strokeOpacity="0.7" strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                          />
                          <rect
                            x="16" y="16" width="268" height="388" rx="1"
                            fill="none" stroke={theme.accent} strokeOpacity="0.35" strokeWidth="0.7"
                            vectorEffect="non-scaling-stroke"
                          />
                          {/* Dotted inner guide line */}
                          <rect
                            x="24" y="24" width="252" height="372"
                            fill="none" stroke={theme.accent} strokeOpacity="0.4" strokeWidth="0.8"
                            strokeDasharray="1.5 4" strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                          />

                          {/* Corner arcs (double, concentric) */}
                          <path
                            d="M16 52 A36 36 0 0 0 52 16 M16 40 A24 24 0 0 0 40 16
       M248 16 A36 36 0 0 0 284 52 M260 16 A24 24 0 0 0 284 40
       M16 368 A36 36 0 0 1 52 404 M16 380 A24 24 0 0 1 40 404
       M248 404 A36 36 0 0 1 284 368 M260 404 A24 24 0 0 1 284 380"
                            fill="none" stroke={theme.accent} strokeOpacity="0.85" strokeWidth="1.1"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                          />
                          {/* Corner dots */}
                          <g fill={theme.accent} fillOpacity="0.8">
                            <circle cx="30" cy="30" r="1.8" />
                            <circle cx="270" cy="30" r="1.8" />
                            <circle cx="30" cy="390" r="1.8" />
                            <circle cx="270" cy="390" r="1.8" />
                          </g>

                          {/* Top & bottom center ornaments */}
                          <g fill="none" stroke={theme.accent} strokeOpacity="0.85" strokeWidth="1" vectorEffect="non-scaling-stroke">
                            <path d="M150 6 L160 16 L150 26 L140 16 Z" fill={theme.accent} fillOpacity="0.9" />
                            <path d="M150 414 L160 404 L150 394 L140 404 Z" fill={theme.accent} fillOpacity="0.9" />
                            <path d="M118 16 H132 M168 16 H182 M118 404 H132 M168 404 H182" strokeLinecap="round" />
                          </g>
                          <g fill={theme.accent} fillOpacity="0.8">
                            <circle cx="110" cy="16" r="1.6" />
                            <circle cx="190" cy="16" r="1.6" />
                            <circle cx="110" cy="404" r="1.6" />
                            <circle cx="190" cy="404" r="1.6" />
                          </g>

                          {/* Side mid diamonds */}
                          <g fill={theme.accent} fillOpacity="0.85">
                            <path d="M16 204 L21 210 L16 216 L11 210 Z" />
                            <path d="M284 204 L289 210 L284 216 L279 210 Z" />
                          </g>
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
            className="font-serif text-sm tabular-nums tracking-widest text-[#ccc]"
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