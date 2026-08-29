"use client";

import { useState, RefObject } from "react";
import { FileDown, ImageDown, Loader2 } from "lucide-react";
import { exportAsImage, exportAsPdf } from "@/lib/exportBiodata";

export default function ExportBar({
  targetRef,
  filename,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  filename: string;
}) {
  const [busy, setBusy] = useState<"pdf" | "png" | null>(null);

  async function handlePdf() {
    if (!targetRef.current) return;
    setBusy("pdf");
    try {
      await exportAsPdf(targetRef.current, filename);
    } finally {
      setBusy(null);
    }
  }

  async function handlePng() {
    if (!targetRef.current) return;
    setBusy("png");
    try {
      await exportAsImage(targetRef.current, filename);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={handlePdf} disabled={busy !== null} className="btn-primary">
        {busy === "pdf" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">Download</span> PDF
      </button>
      <button onClick={handlePng} disabled={busy !== null} className="btn-outline-accent">
        {busy === "png" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageDown className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">Download</span> Image
      </button>
    </div>
  );
}
