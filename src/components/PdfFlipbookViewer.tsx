"use client";

import React, { useState } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface PdfFlipbookViewerProps {
  pages: React.ReactNode[];
  templateName: string;
  onClose?: () => void;
  isFullscreen?: boolean;
}

export default function PdfFlipbookViewer({
  pages,
  templateName,
  onClose,
  isFullscreen = false,
}: PdfFlipbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(isFullscreen);

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

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{templateName}</h2>
            <p className="text-sm text-stone-400">
              Page {currentPage + 1} of {pages.length}
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-stone-400 hover:text-white transition"
            title="Exit fullscreen"
          >
            ✕
          </button>
        </div>

        {/* Viewer */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          <div className="max-w-4xl w-full max-h-full flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-stone-50 p-6">
                <div className="scale-75 origin-center">{pages[currentPage]}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <button
            onClick={goToPrevious}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg transition"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Page Indicators */}
          <div className="flex gap-1 flex-wrap justify-center">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`w-2 h-2 rounded-full transition ${
                  i === currentPage ? "bg-blue-500" : "bg-stone-600"
                }`}
                title={`Go to page ${i + 1}`}
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
  }

  return (
    <div className="w-full bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
      {/* Compact Viewer */}
      <div className="relative bg-stone-50 aspect-video flex items-center justify-center overflow-hidden">
        <div className="scale-50 origin-center pointer-events-none">
          {pages[currentPage]}
        </div>

        {/* Navigation Overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 hover:opacity-100 transition-opacity bg-black/5">
          <button
            onClick={goToPrevious}
            className="bg-white/90 hover:bg-white p-2 rounded-full shadow transition"
            title="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-stone-900" />
          </button>
          <button
            onClick={goToNext}
            className="bg-white/90 hover:bg-white p-2 rounded-full shadow transition"
            title="Next page"
          >
            <ChevronRight className="w-5 h-5 text-stone-900" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-stone-200 bg-stone-50">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="p-1.5 hover:bg-stone-200 rounded transition"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-stone-600 min-w-16 text-center">
            {currentPage + 1} / {pages.length}
          </span>
          <button
            onClick={goToNext}
            className="p-1.5 hover:bg-stone-200 rounded transition"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page Dots */}
        <div className="flex gap-1">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`w-1.5 h-1.5 rounded-full transition ${
                i === currentPage ? "bg-blue-500" : "bg-stone-300"
              }`}
              title={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIsExpanded(true)}
          className="p-1.5 hover:bg-stone-200 rounded transition"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
