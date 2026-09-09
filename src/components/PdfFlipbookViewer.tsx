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
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// react-pdf needs the pdf.js worker. Match the version to your installed
// pdfjs-dist (`npm ls pdfjs-dist`) if this ever drifts out of sync.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface HeaderPage {
  title: string;
  subtitle?: string;
  description?: string;
  /** Any valid CSS color for the cover background. Defaults to the book's maroon. */
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
}

const A4_RATIO = 210 / 297;

export default function PdfFlipbookViewer({
  fileUrl,
  title,
  headerPage,
  pageAspectRatio = A4_RATIO,
}: PdfFlipbookViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);

  // Measure available width so the book scales to its container / viewport.
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
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

  // Single-page width; HTMLFlipBook lays two side by side on wide screens.
  const maxSpreadWidth = 920;
  const pageWidth = Math.min(containerWidth, maxSpreadWidth) / 2 - 8;
  const pageHeight = pageWidth / pageAspectRatio;

  return (
    <div className="w-full flex flex-col items-center">
      {title && (
        <p className="mb-3 text-sm tracking-wide text-[#8a6a1f] font-serif italic">
          {title}
        </p>
      )}

      <div
        ref={containerRef}
        className="relative w-full max-w-[920px] flex justify-center"
      >
        {/* Book shadow / stand, so the pages don't float on nothing */}
        <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 w-[85%] h-6 rounded-full bg-[#3d2b1f]/25 blur-lg" />

        <div className="relative rounded-[6px] p-3 sm:p-5 bg-gradient-to-b from-[#7a1f2b] to-[#5c1620] shadow-[0_18px_40px_-12px_rgba(61,43,31,0.55)]">
          {/* Inner "page well" so covers read as bound leather, not a card */}
          <div className="rounded-[3px] bg-[#fbf5e9] p-1">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div
                  style={{ width: pageWidth * 2, height: pageHeight }}
                  className="flex items-center justify-center text-[#7a1f2b] text-sm font-serif"
                >
                  Opening the biodata…
                </div>
              }
              error={
                <div
                  style={{ width: pageWidth * 2, height: pageHeight }}
                  className="flex items-center justify-center text-center px-6 text-[#7a1f2b] text-sm"
                >
                  Couldn&apos;t open this PDF. Double-check the file and try
                  again.
                </div>
              }
            >
              {isReady && numPages && pageWidth > 0 && (
                // @ts-ignore -- react-pageflip's types lag its runtime API
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
                  maxShadowOpacity={0.4}
                  mobileScrollSupport
                  onFlip={(e: { data: number }) => setCurrentPage(e.data)}
                  className="drop-shadow-md"
                >
                  {headerPage && (
                    <div
                      className="flex flex-col items-center justify-center text-center px-8"
                      style={{
                        background: headerPage.accentColor ?? "#7a1f2b",
                      }}
                    >
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#fbf5e9] mb-3">
                        {headerPage.title}
                      </h2>
                      {headerPage.subtitle && (
                        <p className="text-sm tracking-wide uppercase text-[#e8c98a] mb-4">
                          {headerPage.subtitle}
                        </p>
                      )}
                      {headerPage.description && (
                        <p className="text-xs text-[#fbf5e9]/80 max-w-xs">
                          {headerPage.description}
                        </p>
                      )}
                    </div>
                  )}
                  {Array.from({ length: numPages }, (_, i) => (
                    <div
                      key={i}
                      className="bg-white flex items-center justify-center overflow-hidden"
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
            className="w-9 h-9 rounded-full border border-[#b08d57] text-[#7a1f2b] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#b08d57]/10 transition-colors"
          >
            ‹
          </button>

          <span className="font-serif text-sm text-[#5c1620] tabular-nums">
            Page {currentPage + 1} of {numPages + (headerPage ? 1 : 0)}
          </span>

          <button
            onClick={goNext}
            disabled={currentPage >= numPages - 1 + (headerPage ? 1 : 0)}
            aria-label="Next page"
            className="w-9 h-9 rounded-full border border-[#b08d57] text-[#7a1f2b] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#b08d57]/10 transition-colors"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}