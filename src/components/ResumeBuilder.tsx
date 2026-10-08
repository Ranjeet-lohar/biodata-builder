"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import ExportBar from "@/components/ExportBar";
import PreviewScaler from "@/components/PreviewScaler";
import SortableResumeSection, {
  DEFAULT_RESUME_EDITOR_ORDER,
  normalizeResumeEditorOrder,
} from "@/components/SortableResumeSection";
import type { ResumeEditorSectionId } from "@/components/SortableResumeSection";
import { TextField } from "@/components/Field";
import ResumeTemplate from "@/components/ResumeTemplate";
import {
  emptyResume,
  resumeTemplates,
  type ResumeDocument,
  type ResumeEducation,
  type ResumeExperience,
  type ResumeTemplateId,
} from "@/lib/resumeTypes";

const STORAGE_KEY = "resume-builder:draft";
const DEFAULT_TEMPLATE: ResumeTemplateId = "professional";

const PdfFlipbookViewer = dynamic(
  () => import("@/components/PdfFlipbookViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full items-center justify-center py-16 text-sm text-white">
        Opening resume flipbook…
      </div>
    ),
  }
);

function createEntryId() {
  return `resume_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function newExperience(): ResumeExperience {
  return {
    id: createEntryId(),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

function newEducation(): ResumeEducation {
  return {
    id: createEntryId(),
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    details: "",
  };
}

function isResumeDocument(value: unknown): value is ResumeDocument {
  if (!value || typeof value !== "object") return false;
  const resume = value as ResumeDocument;
  return (
    typeof resume.fullName === "string" &&
    typeof resume.jobTitle === "string" &&
    typeof resume.email === "string" &&
    typeof resume.phone === "string" &&
    typeof resume.location === "string" &&
    typeof resume.website === "string" &&
    typeof resume.summary === "string" &&
    typeof resume.skills === "string" &&
    typeof resume.certifications === "string" &&
    Array.isArray(resume.experience) &&
    Array.isArray(resume.education)
  );
}

function isResumeTemplateId(value: unknown): value is ResumeTemplateId {
  return resumeTemplates.some((template) => template.id === value);
}

export default function ResumeBuilder() {
  const router = useRouter();
  const [resume, setResume] = useState<ResumeDocument>(emptyResume);
  const [editorSectionOrder, setEditorSectionOrder] =
    useState<ResumeEditorSectionId[]>([...DEFAULT_RESUME_EDITOR_ORDER]);
  const [templateId, setTemplateId] =
    useState<ResumeTemplateId>(DEFAULT_TEMPLATE);
  const [captureTemplateId, setCaptureTemplateId] =
    useState<ResumeTemplateId>(DEFAULT_TEMPLATE);
  const [flipbookUrl, setFlipbookUrl] = useState<string | null>(null);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [flipbookLoading, setFlipbookLoading] = useState(false);
  const [flipbookProgress, setFlipbookProgress] = useState(0);
  const [flipbookError, setFlipbookError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const captureTemplateRef = useRef<HTMLDivElement>(null);
  const flipbookRequestId = useRef(0);
  const templateTrackRef = useRef<HTMLDivElement>(null);
  const templateCardRefs = useRef<
    Partial<Record<ResumeTemplateId, HTMLButtonElement | null>>
  >({});
  const sectionSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (localStorage.getItem("demo-auth") !== "true") {
      router.replace("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time auth check on mount
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: unknown = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          const draft = saved as {
            resume?: unknown;
            templateId?: unknown;
            editorSectionOrder?: unknown;
          };
          const savedResume = isResumeDocument(draft.resume)
            ? draft.resume
            : isResumeDocument(saved)
              ? saved
              : null;

          if (savedResume) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- restore the saved draft once on mount
            setResume(savedResume);
          }
          setEditorSectionOrder(
            normalizeResumeEditorOrder(draft.editorSectionOrder)
          );
          if (isResumeTemplateId(draft.templateId)) {
            selectTemplate(draft.templateId);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load the saved resume draft:", error);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ resume, templateId, editorSectionOrder })
      );
    } catch (error) {
      console.error("Failed to save the resume draft:", error);
    }
  }, [hydrated, resume, templateId, editorSectionOrder]);

  useEffect(() => {
    return () => {
      if (flipbookUrl) URL.revokeObjectURL(flipbookUrl);
    };
  }, [flipbookUrl]);

  useEffect(() => {
    exportRef.current =
      captureTemplateId === templateId ? captureTemplateRef.current : null;
  }, [captureTemplateId, resume, templateId]);

  function update(patch: Partial<ResumeDocument>) {
    setResume((current) => ({ ...current, ...patch }));
  }

  function selectTemplate(id: ResumeTemplateId) {
    setTemplateId(id);
    setCaptureTemplateId(id);
  }

  function handleEditorSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setEditorSectionOrder((currentOrder) => {
      const oldIndex = currentOrder.findIndex((id) => id === active.id);
      const newIndex = currentOrder.findIndex((id) => id === over.id);
      if (oldIndex < 0 || newIndex < 0) return currentOrder;
      return arrayMove(currentOrder, oldIndex, newIndex);
    });
  }

  function moveEditorSection(id: ResumeEditorSectionId, direction: -1 | 1) {
    setEditorSectionOrder((currentOrder) => {
      const currentIndex = currentOrder.indexOf(id);
      const nextIndex = currentIndex + direction;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentOrder.length) {
        return currentOrder;
      }
      return arrayMove(currentOrder, currentIndex, nextIndex);
    });
  }

  function updateExperience(id: string, patch: Partial<ResumeExperience>) {
    update({
      experience: resume.experience.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry
      ),
    });
  }

  function updateEducation(id: string, patch: Partial<ResumeEducation>) {
    update({
      education: resume.education.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry
      ),
    });
  }

  function moveTemplate(direction: -1 | 1) {
    const currentIndex = resumeTemplates.findIndex(
      (template) => template.id === templateId
    );
    const nextIndex = Math.max(
      0,
      Math.min(resumeTemplates.length - 1, currentIndex + direction)
    );
    const nextTemplate = resumeTemplates[nextIndex];
    if (nextTemplate) selectTemplate(nextTemplate.id);
  }

  async function handlePreviewFlipbook() {
    if (flipbookLoading) return;
    const requestId = ++flipbookRequestId.current;
    setFlipbookLoading(true);
    setShowFlipbook(true);
    setFlipbookProgress(0);
    setFlipbookError(null);
    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      let pdf: InstanceType<typeof jsPDF> | null = null;
      for (const [index, template] of resumeTemplates.entries()) {
        if (requestId !== flipbookRequestId.current) return;
        setCaptureTemplateId(template.id);
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
        if (requestId !== flipbookRequestId.current) return;

        const node = captureTemplateRef.current;
        if (!node) {
          throw new Error(`Resume template "${template.name}" is not ready.`);
        }

        const canvas = await html2canvas(node, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#ffffff",
          onclone: (clonedDocument) => {
            clonedDocument.querySelector(".resume-live-preview")?.remove();
          },
        });
        if (requestId !== flipbookRequestId.current) return;
        if (canvas.width === 0 || canvas.height === 0) {
          throw new Error(`Resume template "${template.name}" produced an empty page.`);
        }

        const orientation =
          canvas.width >= canvas.height ? "landscape" : "portrait";
        const pageFormat: [number, number] = [canvas.width, canvas.height];
        if (index === 0) {
          pdf = new jsPDF({
            orientation,
            unit: "px",
            format: pageFormat,
            compress: true,
          });
        } else if (pdf) {
          pdf.addPage(pageFormat, orientation);
        } else {
          throw new Error("The resume flipbook could not be initialized.");
        }
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.9),
          "JPEG",
          0,
          0,
          canvas.width,
          canvas.height
        );
        setFlipbookProgress(index + 1);
      }

      if (!pdf) throw new Error("No resume templates are available.");
      if (requestId !== flipbookRequestId.current) return;
      const nextUrl = URL.createObjectURL(pdf.output("blob"));
      setFlipbookUrl((previousUrl) => {
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        return nextUrl;
      });
    } catch (error) {
      if (requestId !== flipbookRequestId.current) return;
      console.error("Failed to prepare resume flipbook:", error);
      setFlipbookError("Could not prepare the resume flipbook. Please try again.");
    } finally {
      if (requestId === flipbookRequestId.current) {
        setFlipbookLoading(false);
        setCaptureTemplateId(templateId);
      }
    }
  }

  function closeFlipbook() {
    flipbookRequestId.current += 1;
    setFlipbookLoading(false);
    setCaptureTemplateId(templateId);
    setFlipbookUrl((previousUrl) => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return null;
    });
    setShowFlipbook(false);
  }

  useEffect(() => {
    const track = templateTrackRef.current;
    const selectedCard = templateCardRefs.current[templateId];
    if (!track || !selectedCard) return;
    track.scrollTo({
      left:
        selectedCard.offsetLeft -
        track.offsetLeft -
        (track.clientWidth - selectedCard.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [templateId]);

  if (!authChecked) {
    return <div className="min-h-screen bg-ambient" />;
  }

  return (
    <div className="min-h-screen bg-ambient">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1720px] px-3 py-5 sm:px-6 sm:py-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#247b83]">
            Career documents
          </p>
          <h1 className="mt-1 text-2xl font-bold text-stone-900 sm:text-3xl">
            Resume Builder
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Build a professional resume, preview it as you edit, and download it
            as a PDF or image.
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="glass-panel rounded p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-stone-900">
                Resume sections
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                Drag a section to organize your editing workspace. This order
                does not change the resume preview or export.
              </p>
            </div>
            <DndContext
              sensors={sectionSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleEditorSectionDragEnd}
            >
              <SortableContext
                items={editorSectionOrder}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {editorSectionOrder.map((sectionId, sectionIndex) => {
                    if (sectionId === "profile") {
                      return (
                        <SortableResumeSection
                          key={sectionId}
                          id={sectionId}
                          title="Profile"
                          index={sectionIndex}
                          total={editorSectionOrder.length}
                          onMove={moveEditorSection}
                        >
                          <h3 className="mb-3 text-sm font-medium text-stone-700">
                            Personal information
                          </h3>
                          <div className="grid gap-x-4 sm:grid-cols-2">
                            <TextField label="Full name" value={resume.fullName} onChange={(value) => update({ fullName: value })} placeholder="Jordan Lee" />
                            <TextField label="Professional title" value={resume.jobTitle} onChange={(value) => update({ jobTitle: value })} placeholder="Product Designer" />
                            <TextField label="Email" value={resume.email} onChange={(value) => update({ email: value })} placeholder="jordan@example.com" />
                            <TextField label="Phone" value={resume.phone} onChange={(value) => update({ phone: value })} placeholder="+1 555 010 1234" />
                            <TextField label="Location" value={resume.location} onChange={(value) => update({ location: value })} placeholder="City, Country" />
                            <TextField label="Website or LinkedIn" value={resume.website} onChange={(value) => update({ website: value })} placeholder="linkedin.com/in/jordanlee" />
                          </div>
                          <TextField label="Professional summary" value={resume.summary} onChange={(value) => update({ summary: value })} placeholder="A short overview of your experience, strengths, and goals." textarea />
                          <TextField label="Skills (comma separated)" value={resume.skills} onChange={(value) => update({ skills: value })} placeholder="Research, Figma, Prototyping" textarea />
                          <TextField label="Certifications (one per line)" value={resume.certifications} onChange={(value) => update({ certifications: value })} placeholder={"Certification name\nIssuing organization"} textarea />
                        </SortableResumeSection>
                      );
                    }

                    if (sectionId === "experience") {
                      return (
                        <SortableResumeSection
                          key={sectionId}
                          id={sectionId}
                          title="Experience"
                          index={sectionIndex}
                          total={editorSectionOrder.length}
                          onMove={moveEditorSection}
                          actions={
                            <button
                              type="button"
                              onClick={() =>
                                update({
                                  experience: [
                                    ...resume.experience,
                                    newExperience(),
                                  ],
                                })
                              }
                              className="btn-outline"
                            >
                              <Plus className="h-4 w-4" /> Add role
                            </button>
                          }
                        >
                          {resume.experience.length === 0 && (
                            <p className="text-sm text-stone-500">
                              Add your current or most recent role.
                            </p>
                          )}
                          <div className="space-y-4">
                            {resume.experience.map((entry, index) => (
                              <div key={entry.id} className="rounded border border-stone-200 bg-white/50 p-3">
                                <div className="mb-2 flex items-center justify-between">
                                  <h3 className="text-sm font-semibold text-stone-700">Role {index + 1}</h3>
                                  <button
                                    type="button"
                                    aria-label={`Remove role ${index + 1}`}
                                    onClick={() => update({ experience: resume.experience.filter((item) => item.id !== entry.id) })}
                                    className="text-stone-500 transition hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="grid gap-x-4 sm:grid-cols-2">
                                  <TextField label="Job title" value={entry.role} onChange={(value) => updateExperience(entry.id, { role: value })} />
                                  <TextField label="Company" value={entry.company} onChange={(value) => updateExperience(entry.id, { company: value })} />
                                  <TextField label="Location" value={entry.location} onChange={(value) => updateExperience(entry.id, { location: value })} />
                                  <div className="grid grid-cols-2 gap-2">
                                    <TextField label="Start date" value={entry.startDate} onChange={(value) => updateExperience(entry.id, { startDate: value })} placeholder="Jan 2022" />
                                    <TextField label="End date" value={entry.endDate} onChange={(value) => updateExperience(entry.id, { endDate: value })} placeholder="Present" />
                                  </div>
                                </div>
                                <TextField label="Highlights and achievements" value={entry.description} onChange={(value) => updateExperience(entry.id, { description: value })} textarea />
                              </div>
                            ))}
                          </div>
                        </SortableResumeSection>
                      );
                    }

                    return (
                      <SortableResumeSection
                        key={sectionId}
                        id={sectionId}
                        title="Education"
                        index={sectionIndex}
                        total={editorSectionOrder.length}
                        onMove={moveEditorSection}
                        actions={
                          <button
                            type="button"
                            onClick={() =>
                              update({
                                education: [
                                  ...resume.education,
                                  newEducation(),
                                ],
                              })
                            }
                            className="btn-outline"
                          >
                            <Plus className="h-4 w-4" /> Add education
                          </button>
                        }
                      >
                        {resume.education.length === 0 && (
                          <p className="text-sm text-stone-500">
                            Add your most relevant education.
                          </p>
                        )}
                        <div className="space-y-4">
                          {resume.education.map((entry, index) => (
                            <div key={entry.id} className="rounded border border-stone-200 bg-white/50 p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-stone-700">Education {index + 1}</h3>
                                <button
                                  type="button"
                                  aria-label={`Remove education ${index + 1}`}
                                  onClick={() => update({ education: resume.education.filter((item) => item.id !== entry.id) })}
                                  className="text-stone-500 transition hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="grid gap-x-4 sm:grid-cols-2">
                                <TextField label="Degree or qualification" value={entry.degree} onChange={(value) => updateEducation(entry.id, { degree: value })} />
                                <TextField label="School or institution" value={entry.institution} onChange={(value) => updateEducation(entry.id, { institution: value })} />
                                <TextField label="Location" value={entry.location} onChange={(value) => updateEducation(entry.id, { location: value })} />
                                <div className="grid grid-cols-2 gap-2">
                                  <TextField label="Start date" value={entry.startDate} onChange={(value) => updateEducation(entry.id, { startDate: value })} placeholder="2018" />
                                  <TextField label="End date" value={entry.endDate} onChange={(value) => updateEducation(entry.id, { endDate: value })} placeholder="2022" />
                                </div>
                              </div>
                              <TextField label="Additional details" value={entry.details} onChange={(value) => updateEducation(entry.id, { details: value })} textarea />
                            </div>
                          ))}
                        </div>
                      </SortableResumeSection>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </section>

          <section className="min-w-0 lg:sticky lg:top-24">
            <div className="mb-3 rounded border border-white/60 bg-white/70 p-3 shadow-sm">
              <div className="mb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-stone-800">Choose a template</h2>
                    <p className="mt-1 text-xs text-stone-500">
                      Switch designs any time; your resume content stays the same.
                    </p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-stone-500">
                    {resumeTemplates.findIndex((template) => template.id === templateId) + 1}
                    {" / "}
                    {resumeTemplates.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous resume template"
                  title="Previous template"
                  disabled={templateId === resumeTemplates[0].id}
                  onClick={() => moveTemplate(-1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div
                  ref={templateTrackRef}
                  className="flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth py-1"
                  aria-label="Resume template choices"
                >
                {resumeTemplates.map((template) => {
                  const selected = templateId === template.id;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      ref={(node) => {
                        templateCardRefs.current[template.id] = node;
                      }}
                      aria-pressed={selected}
                      onClick={() => selectTemplate(template.id)}
                      className="w-[42%] min-w-[132px] max-w-[190px] shrink-0 snap-center rounded border bg-white p-2 text-left transition hover:border-stone-400 sm:w-[31%]"
                      style={{
                        borderColor: selected ? template.accent : undefined,
                        boxShadow: selected
                          ? `0 0 0 1px ${template.accent}55`
                          : undefined,
                        backgroundColor: selected ? `${template.accent}08` : undefined,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="relative mb-2 flex h-16 overflow-hidden rounded border border-black/5"
                        style={{ backgroundColor: template.background, color: template.accent }}
                      >
                        {template.id === "professional" ||
                        template.id === "executive" ||
                        template.id === "botanical" ? (
                          <>
                            <span
                              className="w-1/3 p-1.5"
                              style={{
                                backgroundColor:
                                  template.id === "executive"
                                    ? "#232a32"
                                    : template.id === "botanical"
                                      ? "#294b38"
                                      : `${template.accent}22`,
                              }}
                            >
                              <span className="mb-2 block h-1 w-4 rounded" style={{ backgroundColor: template.accent }} />
                              <span className="mb-1 block h-1 w-full rounded bg-slate-400/50" />
                              <span className="block h-1 w-3/4 rounded bg-slate-400/50" />
                            </span>
                            <span className="flex-1 p-1.5">
                              <span className="mb-2 block h-2 w-4/5 rounded bg-slate-700/70" />
                              <span className="mb-1 block h-1 w-full rounded bg-slate-400/50" />
                              <span className="mb-1 block h-1 w-5/6 rounded bg-slate-400/50" />
                              <span className="block h-1 w-3/4 rounded bg-slate-400/50" />
                            </span>
                          </>
                        ) : template.id === "classic" ||
                          template.id === "elegant" ||
                          template.id === "heritage-biodata" ||
                          template.id === "marigold" ? (
                          <span className="w-full p-2">
                            <span className="mx-auto mb-1 block h-2 w-2/3 rounded" style={{ backgroundColor: `${template.accent}bb` }} />
                            <span className="mx-auto mb-2 block h-1 w-1/2 rounded bg-slate-400/60" />
                            <span className="mb-1 block h-px w-full" style={{ backgroundColor: `${template.accent}80` }} />
                            <span className="mb-1 block h-1 w-4/5 rounded bg-slate-400/50" />
                            <span className="mb-1 block h-1 w-full rounded bg-slate-400/50" />
                            <span className="block h-1 w-3/4 rounded bg-slate-400/50" />
                          </span>
                        ) : template.id === "modern" || template.id === "creative" ? (
                          <span className="w-full">
                            <span className="block h-6" style={{ backgroundColor: template.accent }} />
                            <span className="flex gap-1.5 p-2">
                              <span className="flex-1">
                                <span className="mb-1 block h-1 w-full rounded bg-slate-500/50" />
                                <span className="mb-1 block h-1 w-4/5 rounded bg-slate-500/50" />
                                <span className="block h-1 w-3/4 rounded bg-slate-500/50" />
                              </span>
                              <span className="w-1/4 rounded" style={{ backgroundColor: `${template.accent}22` }} />
                            </span>
                          </span>
                        ) : template.id === "compact" ||
                          template.id === "tech" ||
                          template.id === "geometric" ? (
                          <span className="w-full p-2">
                            <span
                              className={`mb-2 block h-2 w-full ${template.id === "tech" ? "bg-[#132638]" : ""}`}
                              style={
                                template.id === "compact" || template.id === "geometric"
                                  ? { backgroundColor: `${template.accent}55` }
                                  : undefined
                              }
                            />
                            <span className="flex gap-2">
                              <span className="flex-[1.4]">
                                <span className="mb-1 block h-1 w-full rounded bg-slate-500/50" />
                                <span className="mb-1 block h-1 w-4/5 rounded bg-slate-500/50" />
                                <span className="block h-1 w-full rounded bg-slate-500/50" />
                              </span>
                              <span className="flex-1">
                                <span className="mb-1 block h-1 w-full rounded" style={{ backgroundColor: `${template.accent}80` }} />
                                <span className="mb-1 block h-1 w-4/5 rounded bg-slate-500/50" />
                                <span className="block h-1 w-3/4 rounded bg-slate-500/50" />
                              </span>
                            </span>
                          </span>
                        ) : template.id === "minimal" ? (
                          <span className="w-full px-3 py-2">
                            <span className="mb-2 block h-2 w-2/3 rounded" style={{ backgroundColor: `${template.accent}90` }} />
                            <span className="mb-2 block h-px w-full" style={{ backgroundColor: `${template.accent}55` }} />
                            <span className="mb-1 block h-1 w-full rounded bg-slate-500/40" />
                            <span className="mb-1 block h-1 w-5/6 rounded bg-slate-500/40" />
                            <span className="block h-1 w-3/4 rounded bg-slate-500/40" />
                          </span>
                        ) : (
                          <span className="flex w-full">
                            <span className="w-2" style={{ backgroundColor: template.accent }} />
                            <span className="flex-1 p-2">
                              <span className="mb-2 block h-2 w-3/4 rounded" style={{ backgroundColor: `${template.accent}aa` }} />
                              <span className="mb-1 block h-1 w-full rounded bg-slate-500/40" />
                              <span className="mb-1 block h-1 w-5/6 rounded bg-slate-500/40" />
                              <span className="block h-1 w-2/3 rounded bg-slate-500/40" />
                            </span>
                          </span>
                        )}
                      </span>
                      <span className="block text-xs font-semibold text-stone-800">
                        {template.name}
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-tight text-stone-500">
                        {template.description}
                      </span>
                    </button>
                  );
                })}
                </div>
                <button
                  type="button"
                  aria-label="Next resume template"
                  title="Next template"
                  disabled={templateId === resumeTemplates[resumeTemplates.length - 1].id}
                  onClick={() => moveTemplate(1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded border border-white/60 bg-white/70 p-3 shadow-sm">
              <h2 className="font-semibold text-stone-800">Live preview</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviewFlipbook}
                  disabled={flipbookLoading}
                  className="inline-flex items-center gap-1.5 rounded border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 shadow-sm transition hover:border-[#247b83] hover:text-[#176b55] disabled:cursor-wait disabled:opacity-60"
                >
                  {flipbookLoading ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <BookOpen className="h-3.5 w-3.5" />
                  )}
                  {flipbookLoading ? "Preparing…" : "Flipbook"}
                </button>
                <ExportBar
                  targetRef={exportRef}
                  filename={resume.fullName.trim().replace(/\s+/g, "_") || "resume"}
                />
              </div>
            </div>
            {flipbookError && (
              <p role="alert" className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {flipbookError}
              </p>
            )}
            <div className="resume-live-preview glass-well overflow-hidden rounded p-2 sm:p-4">
              <PreviewScaler>
                <ResumeTemplate resume={resume} templateId={templateId} />
              </PreviewScaler>
            </div>
          </section>
        </div>

        <div
          className="pointer-events-none fixed left-[-10000px] top-0"
          aria-hidden="true"
        >
          <div className="pdf" ref={captureTemplateRef}>
            <ResumeTemplate resume={resume} templateId={captureTemplateId} />
          </div>
        </div>
      </main>
      <AppFooter />
      {showFlipbook && (
        <div className="fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col items-center justify-center overflow-hidden bg-[#17231f]/90 px-0 py-0 backdrop-blur-sm">
          <button
            type="button"
            onClick={closeFlipbook}
            aria-label="Close resume flipbook"
            className="absolute z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-800 shadow-lg transition hover:bg-stone-100"
            style={{
              top: "max(0.75rem, env(safe-area-inset-top))",
              right: "max(0.75rem, env(safe-area-inset-right))",
            }}
          >
            <X className="h-4 w-4" />
          </button>
          {flipbookLoading ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center px-6 text-center text-white"
            >
              <LoaderCircle className="mb-5 h-12 w-12 animate-spin text-emerald-300" />
              <h2 className="text-lg font-semibold">Preparing your resume flipbook</h2>
              <p className="mt-2 text-sm text-white/70">
                Capturing template {flipbookProgress + 1} of {resumeTemplates.length}
              </p>
              <div
                className="mt-5 h-1.5 w-56 overflow-hidden rounded-full bg-white/20"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={resumeTemplates.length}
                aria-valuenow={flipbookProgress}
                aria-label="Resume templates captured"
              >
                <div
                  className="h-full rounded-full bg-emerald-300 transition-[width] duration-200"
                  style={{
                    width: `${(flipbookProgress / resumeTemplates.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          ) : flipbookError ? (
            <div role="alert" className="mx-6 max-w-md text-center text-white">
              <p className="text-lg font-semibold">Could not prepare the resume flipbook</p>
              <p className="mt-2 text-sm text-white/70">{flipbookError}</p>
              <button
                type="button"
                onClick={handlePreviewFlipbook}
                className="mt-5 rounded bg-white px-4 py-2 text-sm font-semibold text-stone-900"
              >
                Try again
              </button>
            </div>
          ) : flipbookUrl ? (
            <PdfFlipbookViewer
              fileUrl={flipbookUrl}
              title={resume.fullName || "Resume"}
              headerPage={{
                title: "Resume Template Gallery",
                subtitle: `${resumeTemplates.length} designs`,
                description: `Explore every resume design${resume.fullName ? ` for ${resume.fullName}` : ""}.`,
                accentColor: "#176b55",
              }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
