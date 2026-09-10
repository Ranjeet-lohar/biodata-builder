"use client";

/**
 * PdfFlipbookViewer
 * ------------------
 * Renders a PDF (e.g. a generated biodata) as a page-turning flipbook —
 * styled like a wedding album rather than a generic document viewer.
 *
 * Install (not included in this project by default):
 *   npm install react-pdf react-pageflip pdfjs-dist
 *
 * react-pdf renders each PDF page to a canvas; react-pageflip wraps those
 * canvases in a 3D page-turn interaction. Both are client-only, so this
 * component must stay a client component ("use client" above) and should
 * be dynamically imported with { ssr: false } wherever it's used:
 *
 *   const PdfFlipbookViewer = dynamic(
 *     () => import("@/components/PdfFlipbookViewer"),
 *     { ssr: false }
 *   );
 *
 * THEMING
 * -------
 * The book's colors are driven by the `theme` prop instead of being
 * hardcoded, so a selected TemplateSelector template can restyle the
 * whole book (cover gradient, ribbon/controls, header leaf) live.
 * See `templateToFlipbookTheme()` in TemplateSelector's module for the
 * mapping from a template's swatch to this shape.
 *
 * v2 changes (fixing the "flat two-slide" look):
 *  - Page well background is back on, so empty PDF margins read as cream
 *    paper instead of stark white next to the cover leather.
 *  - Added a center "gutter" overlay — the dark seam down the middle that
 *    actually makes two pages read as one open book instead of two cards
 *    sitting side by side.
 *  - Each page now has an inset shadow along its spine edge, so the paper
 *    looks like it curves into the binding instead of lying perfectly flat.
 *  - usePortrait is on, so narrow/mobile viewports show a single page
 *    instead of a squeezed, illegible two-up spread.
 */

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

      <div
        ref={containerRef}
        className="relative w-full max-w-[920px] flex justify-center"
      >
        {/* Book shadow / stand, so the pages don't float on nothing */}
        <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 w-[85%] h-6 rounded-full bg-[#3d2b1f]/25 blur-lg" />

        <div
          className="relative rounded-[8px] p-3 sm:p-6 shadow-[0_18px_40px_-12px_rgba(61,43,31,0.55)]"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${theme.primary}, ${theme.secondary})`,
          }}
        >
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
                  {/* Center gutter — the seam that makes two flat pages
                      read as one open book. Skipped in portrait mode since
                      there's only one page visible at a time. */}
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
                        className="flex flex-col items-center justify-center text-center px-8 shadow-[inset_-10px_0_18px_-14px_rgba(0,0,0,0.5)]"
                        style={{
                          background: headerPage.accentColor ?? theme.primary,
                        }}
                      >
                        <h2
                          className="font-serif text-2xl sm:text-3xl mb-3"
                          style={{ color: theme.coverText ?? theme.pageWell }}
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
                        className="flex items-center justify-center overflow-hidden"
                        style={{
                          backgroundColor: theme.pageWell,
                          // Curve the paper into the spine: right edge shadow
                          // on left-hand (even) pages, left edge on right-hand
                          // (odd) pages, matching book-open reading order.
                          boxShadow:
                            i % 2 === 0
                              ? "inset -12px 0 20px -16px rgba(0,0,0,0.35)"
                              : "inset 12px 0 20px -16px rgba(0,0,0,0.35)",
                        }}
                      >
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
            className="font-serif text-sm tabular-nums"
            style={{ color: theme.secondary }}
          >
            Page {currentPage + 1} of {totalLeaves}
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