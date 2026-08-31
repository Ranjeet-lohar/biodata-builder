"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  Sparkles,
  PenLine,
  Eye,
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  Minus,
  Plus,
  RotateCcw,
  Phone, Mail, MessageCircle
} from "lucide-react";

interface Draft {
  id: string;
  name: string;
  templateId: string;
  doc: BiodataDocument;
}

const ZOOM_MIN = 0.7;
const ZOOM_MAX = 1.4;
const ZOOM_STEP = 0.1;

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
  const [zoom, setZoom] = useState(1);

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

  if (!authChecked) {
    return <div className="min-h-screen bg-ambient" />;
  }

  return (
    <div className="min-h-screen bg-ambient flex-col flex justify-between">
      <header className="sticky top-0 z-30 glass-header">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-6 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <figure className="flex items-center shrink-0">
              <img
                src="/logo.png"
                alt="Biodata Builder"
                className="h-16 w-auto object-contain object-left"
              />
            </figure>

            <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-stone-700">
              <Link href="/" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">Home</Link>
              <Link href="/features" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">Features</Link>
              <Link href="/about" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">About</Link>
              <Link href="/pricing" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">Pricing</Link>
              <Link href="/contact" className="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-stone-900">Contact</Link>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <Link href="/login" className="btn btn-ghost hidden sm:inline-flex px-3 py-2 text-sm">Login</Link>
            </div>

            <div className="flex sm:hidden rounded-lg border border-white/60 bg-white/50 backdrop-blur overflow-hidden text-sm shadow-sm shrink-0">
              <button
                onClick={() => setMobileTab("edit")}
                className={`px-3 py-1.5 flex items-center gap-1 transition-colors ${
                  mobileTab === "edit" ? "bg-stone-900 text-white" : "text-stone-700"
                }`}
              >
                <PenLine className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => setMobileTab("preview")}
                className={`px-3 py-1.5 flex items-center gap-1 transition-colors ${
                  mobileTab === "preview" ? "bg-stone-900 text-white" : "text-stone-700"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-3 sm:px-6 py-6">
        <div className="sticky top-20 z-20 mb-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/60 p-3 shadow-lg shadow-stone-900/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <LanguageToggle value={doc.language} onChange={(v) => patchDoc({ language: v })} />
              <FontPackSelector value={doc.fontPackId} onChange={(v) => patchDoc({ fontPackId: v })} />
              <button
                onClick={() => setEditorHidden((h) => !h)}
                className="icon-btn border border-white/60 bg-white/50 backdrop-blur hidden lg:inline-flex shadow-sm"
                title={editorHidden ? "Show editor panel" : "Hide editor panel"}
                aria-label={editorHidden ? "Show editor panel" : "Hide editor panel"}
              >
                {editorHidden ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
              <ExportBar targetRef={exportRef} filename={name.replace(/\s+/g, "_") || "biodata"} />
            </div>

            <ProfilesBar
              currentId={id}
              currentName={name}
              onLoad={handleLoadProfile}
              onNew={handleNew}
              getSnapshot={() => ({ templateId, doc })}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <aside className="hidden  flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/55 p-2 backdrop-blur-xl shadow-lg shadow-stone-900/5 self-start sticky top-24">
            <button
              type="button"
              onClick={() => {
                setMobileTab("edit");
                setEditorHidden(false);
              }}
              className={`icon-btn w-10 h-10 rounded-xl ${mobileTab === "edit" && !editorHidden
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-white/70 text-stone-600"
                }`}
              aria-label="Show editor"
              title="Edit"
            >
              <PenLine className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileTab("preview");
                setEditorHidden(true);
              }}
              className={`icon-btn w-10 h-10 rounded-xl ${mobileTab === "preview" || editorHidden
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-white/70 text-stone-600"
                }`}
              aria-label="Show preview"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowTemplates((s) => !s)}
              className={`icon-btn w-10 h-10 rounded-xl ${showTemplates ? "bg-stone-900 text-white shadow-sm" : "bg-white/70 text-stone-600"
                }`}
              aria-label="Toggle design selector"
              title="Designs"
            >
              <LayoutTemplate className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setEditorHidden((h) => !h)}
              className="icon-btn mt-2 w-10 h-10 rounded-xl bg-white/70 text-stone-600"
              aria-label={editorHidden ? "Show editor panel" : "Hide editor panel"}
              title={editorHidden ? "Show editor" : "Hide editor"}
            >
              {editorHidden ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <button
                onClick={() => setShowTemplates((s) => !s)}
                className="sm:hidden w-full flex items-center justify-between text-sm font-semibold text-stone-800 mb-2 px-1"
              >
                <span className="flex items-center gap-1.5">
                  <LayoutTemplate className="w-4 h-4" /> Choose a design ({templates.length})
                </span>
                <span className="text-stone-400 text-xs">{showTemplates ? "Hide" : "Show"}</span>
              </button>
              <p className="hidden sm:block text-sm font-semibold text-stone-800 mb-2">
                Choose a design ({templates.length} templates)
              </p>
              <div className={`${showTemplates ? "block" : "hidden"} sm:block rounded-[10px] p-[10px] bg-gray-100 border border-white/70 shadow-sm`}>
               <TemplateSelector value={templateId} onChange={setTemplateId} />
              </div>
            </div>

            <div
              className={`grid gap-4 sm:gap-6 items-start transition-[grid-template-columns] duration-200 ${editorHidden ? "lg:grid-cols-[0px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(280px,38rem)_minmax(0,1fr)]"}`}
            >
              <div
                className={`${mobileTab === "preview" ? "hidden" : "block"} ${editorHidden ? "lg:hidden" : "lg:block"
                  } min-w-0 lg:sticky lg:top-[112px] lg:max-h-[calc(100vh-132px)] lg:overflow-y-auto lg:pr-1`}
              >
                <div className="glass-panel rounded-2xl p-3 sm:p-4 space-y-4">
                  <HeaderCard doc={doc} onChange={patchDoc} />
                  {hydrated ? (
                    <SectionsEditor sections={doc.sections} onChange={(sections) => patchDoc({ sections })} />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
                      Loading editor…
                    </div>
                  )}
                </div>
              </div>

              <div className={`${mobileTab === "edit" ? "hidden" : "block"} lg:block lg:sticky lg:top-[112px] min-w-0`}>
                {editorHidden && (
                  <button
                    onClick={() => setEditorHidden(false)}
                    className="hidden lg:inline-flex btn-outline mb-3"
                  >
                    <PanelLeftOpen className="w-3.5 h-3.5" /> Show editor
                  </button>
                )}

                <div className="glass-well rounded-2xl">
                  <div className="m-4 shadow-2xl shadow-stone-900/20 rounded-sm" style={{ maxWidth: 794 }}>
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

      {/* Hidden full-resolution copy used purely for PDF/PNG export */}
      <div className="fixed top-0 left-[-99999px] pointer-events-none pdf html print-area" aria-hidden="true">
        <Template doc={doc} fonts={fonts} ref={exportRef} />
      </div>

    

      <footer className="mt-12 w-full border-t border-stone-200 bg-[#18181b] text-stone-200">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-3 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.9fr] lg:px-8">
          <div>
            <img src="/logo.png" alt="Biodata Builder" width={180} height={50} className="h-10 w-auto" />
            <p className="mt-4 max-w-md text-sm leading-7 text-stone-300">
              Create elegant marriage biodatas with beautiful templates, personal details,
              multilingual support, and print-ready exports in minutes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-stone-400">Quick links</h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-300">
              <li><Link href="/" className="transition hover:text-white">Builder</Link></li>
              <li><Link href="/features" className="transition hover:text-white">Features</Link></li>
              <li><Link href="/about" className="transition hover:text-white">About</Link></li>
              <li><Link href="/pricing" className="transition hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-stone-400">Contact</h3>
            <div className="mt-4 space-y-3 text-sm text-stone-300">
              <a href="tel:+919259903000" className="flex items-center gap-2 transition hover:text-white">
                <Phone className="h-4 w-4 text-[#1e98d7]" />
                +91 92599 03000
              </a>
              <a href="mailto:ranjeet@drupaltechie.com" className="flex items-center gap-2 transition hover:text-white">
                <Mail className="h-4 w-4 text-[#1e98d7]" />
                ranjeet@drupaltechie.com
              </a>
              <div className="flex items-center gap-2 text-stone-400">
                <MessageCircle className="h-4 w-4 text-[#1e98d7]" />
                Organiser: Mamta Sarma
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-3 py-4 text-xs text-stone-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>© 2026 Biodata Builder. All rights reserved.</p>
            <p>Create beautifully • Customize freely • Share confidently</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
