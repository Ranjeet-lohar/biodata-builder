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
  const [isReady, setIsReady] = useState(false);
  const [isPortraitMode, setIsPortraitMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);

  // Measure available width so the book scales to its container / viewport,
  // and drop to single-page portrait mode below ~640px so a spread never
  // gets squeezed into two illegible slivers.
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setContainerWidth(w);
        setIsPortraitMode(w < 640);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
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

  // Single-page width; HTMLFlipBook lays two side by side on wide screens,
  // one at a time in portrait mode.
  const maxSpreadWidth = 920;
  const spreadWidth = Math.min(containerWidth, maxSpreadWidth);
  const pageWidth = isPortraitMode ? spreadWidth - 24 : spreadWidth / 2 - 8;
  const pageHeight = pageWidth / pageAspectRatio;

  const totalLeaves = (numPages ?? 0) + (headerPage ? 1 : 0);

  return (
    <div className="w-full flex flex-col items-center">
      {title && (
        <p
          className="mb-3 text-sm tracking-wide font-serif italic"
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
        className="relative w-full max-w-[920px] flex justify-center py-4"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${theme.accent}22 0%, rgba(0,0,0,0) 70%)`,
          }}
        />

        {/* Book shadow / stand */}
        <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 w-[85%] h-6 rounded-full bg-[#3d2b1f]/25 blur-lg" />

        {/* Ribbon bookmark — purely ornamental, hangs from the spine */}
        <div
          className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-10 z-30"
          style={{
            background: `linear-gradient(to bottom, ${theme.accent}, ${theme.accent}cc)`,
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        />

        <div
          className="relative rounded-[8px] p-3 sm:p-6 shadow-[0_18px_40px_-12px_rgba(61,43,31,0.55)] overflow-hidden"
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
            className="relative rounded-[4px] p-2 sm:p-3"
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
                    maxHeight={820}
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
                        className="relative flex flex-col items-center justify-center text-center px-8 shadow-[inset_-10px_0_18px_-14px_rgba(0,0,0,0.5)] overflow-hidden"
                        style={{
                          background: headerPage.accentColor ?? theme.primary,
                        }}
                      >
                        {/* Ornamental corner flourishes, echoing the ornate
                            biodata border templates this viewer displays. */}
                        {(["top-2 left-2", "top-2 right-2 -scale-x-100", "bottom-2 left-2 -scale-y-100", "bottom-2 right-2 -scale-x-100 -scale-y-100"] as const).map(
                          (pos, idx) => (
                            <svg
                              key={idx}
                              viewBox="0 0 40 40"
                              className={`absolute w-8 h-8 ${pos}`}
                              style={{ color: theme.accent, opacity: 0.85 }}
                            >
                              <path
                                d="M2 2 C 14 2, 18 6, 18 18 M2 2 C 2 14, 6 18, 18 18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              />
                              <circle cx="18" cy="18" r="1.6" fill="currentColor" />
                            </svg>
                          )
                        )}

                        <h2
                          className="font-serif text-2xl sm:text-3xl mb-3"
                          style={{
                            color: theme.coverText ?? theme.pageWell,
                            // Embossed/foil-stamped look: light highlight
                            // above, soft dark below, instead of a flat
                            // printed title.
                            textShadow:
                              "0 1px 0 rgba(255,255,255,0.25), 0 -1px 1px rgba(0,0,0,0.35)",
                          }}
                        >
                          {headerPage.title}
                        </h2>
                        {headerPage.subtitle && (
                          <p
                            className="text-sm tracking-wide uppercase mb-4"
                            style={{ color: theme.accent }}
                          >
                            {headerPage.subtitle}
                          </p>
                        )}
                        {headerPage.description && (
                          <p
                            className="text-xs max-w-xs"
                            style={{ color: `${theme.coverText ?? theme.pageWell}cc` }}
                          >
                            {headerPage.description}
                          </p>
                        )}
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
        <div className="mt-6 flex items-center gap-5">
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