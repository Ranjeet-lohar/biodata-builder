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
  ChevronDown,
} from "lucide-react";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";

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
      <AppHeader/>

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
              <p className="hidden md:block text-sm font-semibold text-stone-800 mb-2">
                Choose a design ({templates.length} templates)
              </p>
              <div
                className={`${showTemplates ? "block" : "hidden"} md:block w-full rounded-[10px] p-2 sm:p-[10px] bg-white/70 border border-white/70 shadow-sm`}
                style={{ ["--fade-bg" as unknown as string]: "rgba(255,255,255,0.75)" }}
              >
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
                  } min-w-0 md:sticky md:top-[132px] md:pr-1`}
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

      <AppFooter />
    </div>
  );
}