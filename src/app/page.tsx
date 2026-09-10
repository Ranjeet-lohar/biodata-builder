"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { BiodataDocument, SavedBiodata } from "@/lib/types";
import { emptyDocument, sampleDocument } from "@/lib/defaultSections";
import { loadDraft, saveDraft } from "@/lib/storage";
import { getTemplate, templates } from "@/components/templates";
import { getFontPack } from "@/lib/fontPacks";
import HeaderCard from "@/components/HeaderCard";
import SectionsEditor from "@/components/SectionsEditor";
import TemplateSelector from "@/components/TemplateSelector";
import PreviewScaler from "@/components/PreviewScaler";
import ExportBar from "@/components/ExportBar";
import ProfilesBar from "@/components/ProfilesBar";
import LanguageToggle from "@/components/LanguageToggle";
import FontPackSelector from "@/components/FontPackSelector";
import {
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  X,
  ChevronDown,
} from "lucide-react";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";

// react-pdf / react-pageflip touch the DOM directly at mount time, so this
// must stay out of the server render pass entirely.
// NOTE: casing must match the real filename exactly — PdfFlipbookViewer.tsx.
const PdfFlipbookViewer = dynamic(
  () => import("@/components/PdfFlipbookViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full py-16 flex items-center justify-center text-[#7a1f2b] font-serif text-sm">
        Preparing the flipbook…
      </div>
    ),
  }
);

interface Draft {
  id: string;
  name: string;
  templateId: string;
  doc: BiodataDocument;
}

function newId() {
  return `bd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isValidDraft(d: unknown): d is Draft {
  if (!d || typeof d !== "object") return false;
  const doc = (d as Draft).doc;
  return !!doc && Array.isArray((doc as BiodataDocument).sections);
}

export default function Home() {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [name, setName] = useState("My Biodata");
  const [templateId, setTemplateId] = useState<string>(templates[0].id);
  const [doc, setDoc] = useState<BiodataDocument>(emptyDocument());
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [hydrated, setHydrated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editorHidden, setEditorHidden] = useState(false);
  const [zoom] = useState(1);

  // Flipbook preview state — pdfUrl stays null until the user actually
  // asks for a preview, so PdfFlipbookViewer never mounts against an
  // empty/invalid source.
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [flipbookLoading, setFlipbookLoading] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem("demo-auth") !== "true") {
      router.replace("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time auth check on mount
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       One-time hydration from localStorage on mount; not a derived-state loop. */
    const draft = loadDraft<Draft>();
    if (isValidDraft(draft)) {
      setId(draft.id);
      setName(draft.name);
      setTemplateId(draft.templateId);
      setDoc(draft.doc);
    } else {
      setId(newId());
      setDoc(sampleDocument());
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft<Draft>({ id, name, templateId, doc });
  }, [id, name, templateId, doc, hydrated]);

  // Release the generated blob URL when it's replaced or the page unmounts,
  // so we don't leak memory across repeated previews.
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const meta = getTemplate(templateId);
  const Template = meta.Component;
  const fonts = getFontPack(doc.fontPackId);

  function patchDoc(patch: Partial<BiodataDocument>) {
    setDoc((d) => ({ ...d, ...patch }));
  }

  function handleLoadProfile(profile: SavedBiodata) {
    setId(profile.id);
    setName(profile.name);
    setTemplateId(profile.templateId);
    setDoc(profile.doc);
  }

  function handleNew() {
    setId(newId());
    setName("New Biodata");
    setDoc(emptyDocument());
  }

  async function handlePreviewFlipbook() {
    if (!exportRef.current || flipbookLoading) return;
    setFlipbookLoading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const node = exportRef.current;
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      const blob = pdf.output("blob");
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Failed to build flipbook preview:", err);
    } finally {
      setFlipbookLoading(false);
    }
  }

  function closeFlipbook() {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
  }

  if (!authChecked) {
    return <div className="min-h-screen bg-ambient" />;
  }

  return (
    <div className="min-h-screen bg-ambient flex-col flex justify-between">
      <AppHeader/>

      <main className="max-w-[1720px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 overflow-x-hidden relative">
        <div className="sticky top-0 z-20 mb-4 sm:mb-5">
          <div className="flex flex-col gap-3 rounded border border-white/60 bg-white/60 p-3 shadow-lg shadow-stone-900/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <LanguageToggle value={doc.language} onChange={(v) => patchDoc({ language: v })} />
              <FontPackSelector value={doc.fontPackId} onChange={(v) => patchDoc({ fontPackId: v })} />
              <button
                onClick={() => setEditorHidden((h) => !h)}
                className="icon-btn border border-white/60 bg-white/50 backdrop-blur hidden md:inline-flex shadow-sm"
                title={editorHidden ? "Show editor panel" : "Hide editor panel"}
                aria-label={editorHidden ? "Show editor panel" : "Hide editor panel"}
              >
                {editorHidden ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
              <button
                onClick={handlePreviewFlipbook}
                disabled={flipbookLoading}
                className="p-1.5 rounded border border-white/60 bg-white/50 backdrop-blur inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Preview as flipbook"
                aria-label="Preview as flipbook"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">
                  {flipbookLoading ? "Preparing…" : "Flipbook"}
                </span>
              </button>
              <ExportBar targetRef={exportRef} filename={name.replace(/\s+/g, "_") || "biodata"} />
            </div>

            <div className="w-full min-w-0 sm:w-auto">
              <ProfilesBar
                currentId={id}
                currentName={name}
                onLoad={handleLoadProfile}
                onNew={handleNew}
                getSnapshot={() => ({ templateId, doc })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          {/* phone-only floating tab switcher — hidden once the md split kicks in */}
          <div
            className="flex md:hidden fixed left-1/2 -translate-x-1/2 z-30 gap-1 rounded-full border border-white/60 bg-white/85 backdrop-blur-xl p-1 shadow-lg shadow-stone-900/10"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
          >
            <button
              type="button"
              onClick={() => { setMobileTab("edit"); setEditorHidden(false); }}
              className={`min-w-[84px] px-4 py-2.5 rounded-full text-sm font-medium transition ${mobileTab === "edit" && !editorHidden ? "bg-stone-900 text-white" : "text-stone-600"
                }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => { setMobileTab("preview"); setEditorHidden(true); }}
              className={`min-w-[84px] px-4 py-2.5 rounded-full text-sm font-medium transition ${mobileTab === "preview" || editorHidden ? "bg-stone-900 text-white" : "text-stone-600"
                }`}
            >
              Preview
            </button>
          </div>

          {/* pb-24 only matters on phones where the floating bar overlaps content */}
          <div className="w-full min-w-0 pb-24 md:pb-0 overflow-hidden">
            <div className="mb-4 sm:mb-6 ">
              <button
                  onClick={() => setShowTemplates((s) => !s)}
                  aria-expanded={showTemplates}
                  className="md:hidden w-full flex items-center justify-between rounded-xl border border-white/60 bg-white/60 px-3 py-2.5 mb-2 shadow-sm backdrop-blur-md transition active:scale-[0.99]"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1e98d7]/10 text-[#1e98d7]">
                      <LayoutTemplate className="h-3.5 w-3.5" />
                    </span>
                    Choose a design
                    <span className="text-xs font-normal text-stone-400">({templates.length})</span>
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${
                      showTemplates ? "rotate-180" : ""
                    }`}
                  />
                </button>
              <p className="hidden md:block text-sm font-semibold text-stone-300 mb-2">
                Choose a design ({templates.length} templates)
              </p>
              <div
                className={`${showTemplates ? "block" : "hidden"} md:block w-full rounded p-2 sm:p-[10px] bg-white/70 border border-white/70 shadow-sm`}
                style={{ ["--fade-bg" as unknown as string]: "rgba(255,255,255,0.75)" }}
              >
                <TemplateSelector value={templateId} onChange={setTemplateId} />
              </div>
            </div>

            <div
              className={`grid gap-4 items-start transition-[grid-template-columns] duration-200 grid-cols-1 ${
                editorHidden
                  ? "md:grid-cols-[0px_1fr] lg:grid-cols-[0px_1fr]"
                  : "md:grid-cols-[1fr_auto] 2xl:grid-cols-[1fr_auto]"
              }`}
            >
              <div
                className={`${mobileTab === "preview" ? "hidden" : "block"} ${editorHidden ? "md:hidden" : "md:block"
                  } min-w-0 md:sticky md:top-[132px] md:pr-1`}
              >
                <div className="glass-panel rounded p-3 sm:p-4 space-y-4">
                  <HeaderCard doc={doc} onChange={patchDoc} />
                  {hydrated ? (
                    <SectionsEditor sections={doc.sections} onChange={(sections) => patchDoc({ sections })} />
                  ) : (
                    <div className="rounded border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
                      Loading editor…
                    </div>
                  )}
                </div>
              </div>

              <div className={`${mobileTab === "edit" ? "hidden" : "block"} md:block md:sticky md:top-[132px] min-w-0`}>
                {editorHidden && (
                  <button
                    onClick={() => setEditorHidden(false)}
                    className="hidden md:inline-flex btn-outline mb-3"
                  >
                    <PanelLeftOpen className="w-3.5 h-3.5" /> Show editor
                  </button>
                )}

                <div className="glass-well rounded overflow-x-auto w-fit ml-auto">
                  <div
                    className="mx-auto sm:my-3 sm:m-4 shadow-2xl shadow-stone-900/20 sm:rounded-sm w-full origin-top"
                    style={{ maxWidth: 794 }}
                  >
                    <PreviewScaler zoom={zoom}>
                      <Template doc={doc} fonts={fonts} />
                    </PreviewScaler>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed top-0 left-[-99999px] pointer-events-none pdf html print-area" aria-hidden="true">
        <Template doc={doc} fonts={fonts} ref={exportRef} />
      </div>

      {/* Flipbook preview overlay — only mounted once a real PDF blob exists */}
      {pdfUrl && (
        <div className="fixed inset-0 z-50 bg-[#2b2420]/70 backdrop-blur-sm flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
          <button
            onClick={closeFlipbook}
            aria-label="Close flipbook preview"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white/90 text-[#5c1620] flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <PdfFlipbookViewer
            fileUrl={pdfUrl}
            title={name}
            headerPage={{
              title: "Wedding Invitation",
              subtitle: "Aarav & Sneha",
              description:
                "Together with their families, we invite you to celebrate this joyful occasion.",
              accentColor: "#8a6a1f",
            }}
          />
        </div>
      )}

      <AppFooter />
    </div>
  );
}