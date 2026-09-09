"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface FlipbookPreviewProps {
  pages: React.ReactNode[];
  templateName: string;
  templateDescription?: string;
}

export default function FlipbookPreview({
  pages,
  templateName,
  templateDescription,
}: FlipbookPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : pages.length - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < pages.length - 1 ? prev + 1 : 0));
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < pages.length) {
      setCurrentPage(page);
    }
  };

  const CompactView = () => (
    <div className="w-full bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Preview Container */}
      <div className="relative bg-gradient-to-b from-stone-50 to-stone-100 aspect-video flex items-center justify-center overflow-hidden group">
        <div className="scale-[30%] origin-center pointer-events-none select-none">
          {pages[currentPage]}
        </div>

        {/* Hover Navigation Overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          <button
            onClick={goToPrevious}
            className="bg-white/95 hover:bg-white p-2.5 rounded-full shadow-lg transition transform hover:scale-110"
            title="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-stone-900" />
          </button>
          <button
            onClick={goToNext}
            className="bg-white/95 hover:bg-white p-2.5 rounded-full shadow-lg transition transform hover:scale-110"
            title="Next page"
          >
            <ChevronRight className="w-5 h-5 text-stone-900" />
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="px-4 py-3 bg-white border-t border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="p-1.5 hover:bg-stone-100 rounded-lg transition"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-stone-700" />
          </button>
          <span className="text-xs font-medium text-stone-600 min-w-12 text-center">
            {currentPage + 1}/{pages.length}
          </span>
          <button
            onClick={goToNext}
            className="p-1.5 hover:bg-stone-100 rounded-lg transition"
            title="Next"
          >
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>
        </div>

        {/* Page Dots */}
        <div className="flex gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`transition-all ${
                i === currentPage
                  ? "bg-blue-500 w-2 h-2"
                  : "bg-stone-300 w-1.5 h-1.5 hover:bg-stone-400"
              }`}
              style={{ borderRadius: "50%" }}
              title={`Page ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIsFullscreen(true)}
          className="p-1.5 hover:bg-stone-100 rounded-lg transition"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4 text-stone-700" />
        </button>
      </div>
    </div>
  );

  const FullscreenView = () => (
    <div className="fixed inset-0 z-50 bg-stone-900/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="bg-stone-950/80 backdrop-blur text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
        <div>
          <h2 className="text-xl font-bold">{templateName}</h2>
          {templateDescription && (
            <p className="text-sm text-stone-400 mt-1">{templateDescription}</p>
          )}
        </div>
        <button
          onClick={() => setIsFullscreen(false)}
          className="p-2 hover:bg-stone-800 rounded-lg transition text-stone-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewer */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="relative max-w-4xl w-full max-h-full flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-center bg-stone-50 p-4">
              <div className="scale-75 origin-center pointer-events-none">
                {pages[currentPage]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-stone-950/80 backdrop-blur text-white px-6 py-4 border-t border-stone-800 flex items-center justify-between">
        <button
          onClick={goToPrevious}
          className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg transition"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Page Indicator */}
        <div className="text-sm font-medium">
          Page <span className="text-blue-400">{currentPage + 1}</span> of{" "}
          <span className="text-blue-400">{pages.length}</span>
        </div>

        {/* Page Dots */}
        <div className="flex gap-1.5 justify-center flex-wrap max-w-xs">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`transition-all ${
                i === currentPage
                  ? "bg-blue-500 w-2.5 h-2.5"
                  : "bg-stone-600 w-2 h-2 hover:bg-stone-500"
              }`}
              style={{ borderRadius: "50%" }}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg transition"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <CompactView />
      {isFullscreen && <FullscreenView />}
    </>
  );
}
