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
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  Phone, Mail, MessageCircle,
  LogIn,
} from "lucide-react";

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
      <header className="sticky hidden top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between px-3 sm:h-16 sm:px-6">
          <Link href="/" className="shrink-0">
            <img
              src="/logo.png"
              alt="Biodata Builder"
              className="h-8 w-auto object-contain xs:h-9 sm:h-12 lg:h-14"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl border border-stone-200 bg-white/70 px-3 py-2 text-sm font-medium sm:inline-flex"
            >
              Login
            </Link>
            {/* Mobile-only login icon so the action isn't lost below sm */}
            <Link
              href="/login"
              aria-label="Login"
              className="icon-btn h-9 w-9 rounded-xl border border-stone-200 bg-white/70 text-stone-700 sm:hidden"
            >
              <LogIn className="h-4 w-4" />
            </Link>

            <div className="flex rounded-xl border border-stone-200 bg-white/80 p-1 shadow-sm md:hidden">
              <button
                onClick={() => {
                  setMobileTab("edit");
                  setEditorHidden(false);
                }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold sm:px-3 ${
                  mobileTab === "edit"
                    ? "bg-stone-900 text-white"
                    : "text-stone-600"
                }`}
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setMobileTab("preview");
                  setEditorHidden(true);
                }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold sm:px-3 ${
                  mobileTab === "preview"
                    ? "bg-stone-900 text-white"
                    : "text-stone-600"
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-3 sm:px-6 py-4 sm:py-6 overflow-x-hidden relative">
        <div className="sticky top-0 z-20 mb-4 sm:mb-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/60 p-3 shadow-lg shadow-stone-900/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <LanguageToggle value={doc.language} onChange={(v) => patchDoc({ language: v })} />
              <FontPackSelector value={doc.fontPackId} onChange={(v) => patchDoc({ fontPackId: v })} />
              {/* was lg:inline-flex — now available as soon as the split layout appears at md */}
              <button
                onClick={() => setEditorHidden((h) => !h)}
                className="icon-btn border border-white/60 bg-white/50 backdrop-blur hidden md:inline-flex shadow-sm"
                title={editorHidden ? "Show editor panel" : "Hide editor panel"}
                aria-label={editorHidden ? "Show editor panel" : "Hide editor panel"}
              >
                {editorHidden ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
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
          <div className="flex-1 min-w-0 pb-24 md:pb-0">
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => setShowTemplates((s) => !s)}
                className="md:hidden w-full flex items-center justify-between text-sm font-semibold text-stone-800 mb-2 px-1"
              >
                <span className="flex items-center gap-1.5">
                  <LayoutTemplate className="w-4 h-4" /> Choose a design ({templates.length})
                </span>
                <span className="text-stone-400 text-xs">{showTemplates ? "Hide" : "Show"}</span>
              </button>
              <p className="hidden md:block text-sm font-semibold text-stone-800 mb-2">
                Choose a design ({templates.length} templates)
              </p>
              <div className={`${showTemplates ? "block" : "hidden"} md:block w-[335px] sm:w-full rounded-[10px] p-2 sm:p-[10px] bg-white/70 border border-white/70 shadow-sm overflow-x-auto`}>
                <TemplateSelector value={templateId} onChange={setTemplateId} />
              </div>
            </div>

            <div
              className={`grid gap-4 items-start transition-[grid-template-columns] duration-200 grid-cols-1 ${editorHidden
                  ? "md:grid-cols-[0px_minmax(0,1fr)] lg:grid-cols-[0px_minmax(0,1fr)]"
                  : "md:grid-cols-[minmax(260px,32rem)_minmax(0,1fr)] lg:grid-cols-[minmax(280px,38rem)_minmax(0,1fr)]"
                }`}
            >
              <div
                className={`${mobileTab === "preview" ? "hidden" : "block"} ${editorHidden ? "md:hidden" : "md:block"
                  } min-w-0 md:sticky md:top-[132px] md:max-h-[calc(100vh-152px)] md:overflow-y-auto md:pr-1`}
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

              <div className={`${mobileTab === "edit" ? "hidden" : "block"} md:block md:sticky md:top-[132px] min-w-0`}>
                {editorHidden && (
                  <button
                    onClick={() => setEditorHidden(false)}
                    className="hidden md:inline-flex btn-outline mb-3"
                  >
                    <PanelLeftOpen className="w-3.5 h-3.5" /> Show editor
                  </button>
                )}

                <div className="glass-well rounded-2xl overflow-x-auto">
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

      <footer className="footer_bg mt-12 w-full border-t border-stone-200 bg-[#18181b] text-stone-200">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-3 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1.3fr_0.8fr_0.9fr] lg:px-8">
          <div>
            <img src="/logo.png" alt="Biodata Builder" width={120} height={50}  />
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
              <a href="tel:+919259903000" className="flex items-center gap-2 transition hover:text-white break-all">
                <Phone className="h-4 w-4 shrink-0 text-[#1e98d7]" />
                +91 92599 03000
              </a>
              <a href="mailto:ranjeet@drupaltechie.com" className="flex items-center gap-2 transition hover:text-white break-all">
                <Mail className="h-4 w-4 shrink-0 text-[#1e98d7]" />
                ranjeet@drupaltechie.com
              </a>
              <div className="flex items-center gap-2 text-stone-400">
                <MessageCircle className="h-4 w-4 shrink-0 text-[#1e98d7]" />
                Organiser: Mamta Sharma
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-3 py-4 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© 2026 Biodata Builder. All rights reserved.</p>
            <p>Create beautifully • Customize freely • Share confidently</p>
          </div>
        </div>
      </footer>
    </div>
  );
}