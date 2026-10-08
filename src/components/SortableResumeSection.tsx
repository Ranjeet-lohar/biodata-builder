"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const DEFAULT_RESUME_EDITOR_ORDER = [
  "profile",
  "experience",
  "education",
] as const;

export type ResumeEditorSectionId =
  (typeof DEFAULT_RESUME_EDITOR_ORDER)[number];

const resumeEditorSectionIds = new Set<string>(DEFAULT_RESUME_EDITOR_ORDER);

export function normalizeResumeEditorOrder(
  value: unknown
): ResumeEditorSectionId[] {
  const savedOrder = Array.isArray(value)
    ? value.filter(
        (id): id is ResumeEditorSectionId =>
          typeof id === "string" && resumeEditorSectionIds.has(id)
      )
    : [];
  const uniqueOrder = [...new Set(savedOrder)];

  return [
    ...uniqueOrder,
    ...DEFAULT_RESUME_EDITOR_ORDER.filter((id) => !uniqueOrder.includes(id)),
  ];
}

export default function SortableResumeSection({
  id,
  title,
  index,
  total,
  onMove,
  actions,
  children,
}: {
  id: ResumeEditorSectionId;
  title: string;
  index: number;
  total: number;
  onMove: (id: ResumeEditorSectionId, direction: -1 | 1) => void;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <section
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
      className={`rounded-lg border bg-white/70 p-4 shadow-sm sm:p-5 ${
        isDragging
          ? "border-[#247b83] opacity-70 shadow-lg"
          : "border-stone-200"
      }`}
    >
      <div className="mb-3 flex min-h-9 items-center gap-2">
        <button
          type="button"
          aria-label={`Drag to reorder ${title}`}
          className="flex h-8 w-8 shrink-0 touch-none cursor-grab items-center justify-center rounded text-stone-400 hover:bg-stone-100 hover:text-stone-700 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex shrink-0">
          <button
            type="button"
            aria-label={`Move ${title} up`}
            title={`Move ${title} up`}
            disabled={index === 0}
            onClick={() => onMove(id, -1)}
            className="flex h-8 w-7 items-center justify-center rounded text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Move ${title} down`}
            title={`Move ${title} down`}
            disabled={index === total - 1}
            onClick={() => onMove(id, 1)}
            className="flex h-8 w-7 items-center justify-center rounded text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <h2 className="flex-1 text-lg font-semibold text-stone-900">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}
