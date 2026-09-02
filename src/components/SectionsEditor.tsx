"use client";

import { useState, useCallback, useMemo } from "react";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Plus,
  ChevronDown,
  Eye,
  EyeOff,
  Copy,
  ArrowUp,
  ArrowDown,
  Layers,
  FileText,
  RotateCcw,
} from "lucide-react";
import { FieldItem, SectionItem, newFieldId, newSectionId,  } from "@/lib/types";
import { TextField } from "./Field";

function emptyField(): FieldItem {
  return { id: newFieldId(), labelEn: "", labelHi: "", value: "" };
}

/* ─── Field Row ─── */
function SectionFieldRow({
  field,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  field: FieldItem;
  index: number;
  total: number;
  onChange: (patch: Partial<FieldItem>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="group/field rounded border border-stone-200 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-stone-300">
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)_auto] gap-2 items-start">
        <input
          className="field-input-sm min-w-0 rounded border-stone-200 focus:border-[#1e98d7] focus:ring-2 focus:ring-[#1e98d7]/20 transition-all"
          value={field.labelEn}
          placeholder="Label (English)"
          onChange={(e) => onChange({ labelEn: e.target.value })}
        />
        <input
          className="field-input-sm min-w-0 rounded border-stone-200 focus:border-[#1e98d7] focus:ring-2 focus:ring-[#1e98d7]/20 transition-all"
          value={field.labelHi}
          placeholder="Label (Hindi)"
          onChange={(e) => onChange({ labelHi: e.target.value })}
        />
        <input
          className="field-input-sm min-w-0 rounded border-stone-200 focus:border-[#1e98d7] focus:ring-2 focus:ring-[#1e98d7]/20 transition-all"
          value={field.value}
          placeholder="Value"
          onChange={(e) => onChange({ value: e.target.value })}
        />
        <div className="flex items-center gap-0.5 justify-self-end sm:justify-self-center opacity-0 group-hover/field:opacity-100 transition-opacity">
          <button type="button" onClick={onMoveUp} disabled={index === 0} className="icon-btn w-7 h-7 disabled:opacity-20">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} className="icon-btn w-7 h-7 disabled:opacity-20">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={onDelete} className="icon-btn w-7 h-7 text-stone-400 hover:text-red-500 hover:bg-red-50">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Section Card ─── */
function SortableSectionCard({
  section,
  onChange,
  onDelete,
  onDuplicate,
}: {
  section: SectionItem;
  onChange: (patch: Partial<SectionItem>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });
  const [open, setOpen] = useState(!section.titleEn.trim());

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : ("auto" as const),
  };

  const updateField = useCallback(
    (fieldId: string, patch: Partial<FieldItem>) => {
      onChange({
        fields: section.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)),
      });
    },
    [section.fields, onChange]
  );

  const deleteField = useCallback(
    (fieldId: string) => onChange({ fields: section.fields.filter((f) => f.id !== fieldId) }),
    [section.fields, onChange]
  );

  const moveField = useCallback(
    (fieldId: string, direction: -1 | 1) => {
      const idx = section.fields.findIndex((f) => f.id === fieldId);
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= section.fields.length) return;
      const newFields = [...section.fields];
      [newFields[idx], newFields[newIdx]] = [newFields[newIdx], newFields[idx]];
      onChange({ fields: newFields });
    },
    [section.fields, onChange]
  );

  const addField = useCallback(() => {
    onChange({ fields: [...section.fields, emptyField()] });
  }, [section.fields, onChange]);

  const isEmpty = !section.titleEn.trim();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded border bg-white overflow-hidden transition-shadow ${
        isDragging ? "ring-2 ring-[#1e98d7] rotate-1" : "border-stone-200  hover:shadow"
      } ${!section.visible ? "opacity-50 grayscale-[0.3]" : ""}`}
    >
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-stone-50 to-white border-b border-stone-100">
        <button type="button" {...attributes} {...listeners} className="icon-btn cursor-grab active:cursor-grabbing touch-none shrink-0 text-stone-400 hover:text-stone-600">
          <GripVertical className="w-4 h-4" />
        </button>

        <div className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${section.type === "grid" ? "bg-[#1e98d7]/10 text-[#1e98d7]" : "bg-amber-500/10 text-amber-600"}`}>
          {section.type === "grid" ? <Layers className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
        </div>

        <button type="button" onClick={() => setOpen((o) => !o)} className="flex-1 min-w-0 text-left flex items-center gap-2 px-1.5 py-1 rounded hover:bg-stone-100/80 transition-colors">
          <span className={`font-semibold text-sm truncate ${isEmpty ? "text-stone-400 italic" : "text-stone-800"}`}>
            {section.titleEn || "Untitled section"}
          </span>
          {section.titleHi && <span className="text-xs text-stone-400 truncate hidden sm:inline">· {section.titleHi}</span>}
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 font-medium shrink-0">{section.fields.length}</span>
        </button>

        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onDuplicate} className="icon-btn text-stone-400 hover:text-stone-600 hover:bg-stone-100 shrink-0" title="Duplicate">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => onChange({ visible: !section.visible })} className={`icon-btn shrink-0 ${section.visible ? "text-stone-500 hover:text-[#1e98d7]" : "text-stone-300 hover:text-stone-500"}`} title={section.visible ? "Visible" : "Hidden"}>
            {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button type="button" onClick={onDelete} className="icon-btn text-stone-400 hover:text-red-500 hover:bg-red-50 shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => setOpen((o) => !o)} className="icon-btn shrink-0 text-stone-400 hover:text-stone-600">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label="Section title (English)" value={section.titleEn} onChange={(v) => onChange({ titleEn: v })} placeholder="e.g. Career Details" />
            <TextField label="Section title (Hindi) — optional" value={section.titleHi} onChange={(v) => onChange({ titleHi: v })} placeholder="जैसे करियर विवरण" />
          </div>

          {section.type === "grid" ? (
            <div className="space-y-2">
              {section.fields.map((f, idx) => (
                <SectionFieldRow
                  key={f.id}
                  field={f}
                  index={idx}
                  total={section.fields.length}
                  onChange={(patch) => updateField(f.id, patch)}
                  onDelete={() => deleteField(f.id)}
                  onMoveUp={() => moveField(f.id, -1)}
                  onMoveDown={() => moveField(f.id, 1)}
                />
              ))}
              <button type="button" onClick={addField} className="w-full btn text-stone-600 border border-dashed border-stone-300 px-3 py-2.5 hover:bg-stone-50 hover:border-stone-400 hover:text-stone-800 transition-all rounded flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add field
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <TextField label="Text (English)" value={section.fields[0]?.value ?? ""} onChange={(v) => updateField(section.fields[0].id, { value: v })} textarea placeholder="Write in English…" />
              <TextField label="Text (Hindi) — optional" value={section.fields[0]?.valueHi ?? ""} onChange={(v) => updateField(section.fields[0].id, { valueHi: v })} textarea placeholder="हिंदी में लिखें…" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ onAddGrid, onAddText }: { onAddGrid: () => void; onAddText: () => void }) {
  return (
    <div className="text-center py-14 px-4 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
        <Layers className="w-7 h-7 text-stone-400" />
      </div>
      <h3 className="text-stone-700 font-semibold text-lg mb-1">No sections yet</h3>
      <p className="text-stone-500 text-sm mb-6 max-w-xs mx-auto">Start building your biodata by adding detail sections or text notes.</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button type="button" onClick={onAddGrid} className="btn-dark">
          <Plus className="w-4 h-4" /> Add detail section
        </button>
        <button type="button" onClick={onAddText} className="btn-outline">
          <Plus className="w-4 h-4" /> Add text note
        </button>
      </div>
    </div>
  );
}

/* ─── Main Editor ─── */
export default function SectionsEditor({
  sections,
  onChange,
  onResetDefaults,
}: {
  sections: SectionItem[];
  onChange: (sections: SectionItem[]) => void;
  onResetDefaults?: () => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      onChange(arrayMove(sections, oldIndex, newIndex));
    },
    [sections, onChange]
  );

  const updateSection = useCallback(
    (id: string, patch: Partial<SectionItem>) => {
      onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    },
    [sections, onChange]
  );

  const deleteSection = useCallback(
    (id: string) => onChange(sections.filter((s) => s.id !== id)),
    [sections, onChange]
  );

  const duplicateSection = useCallback(
    (id: string) => {
      const section = sections.find((s) => s.id === id);
      if (!section) return;
      const cloned: SectionItem = {
        ...section,
        id: newSectionId(),
        titleEn: `${section.titleEn} (Copy)`,
        fields: section.fields.map((f) => ({ ...f, id: newFieldId() })),
      };
      const idx = sections.findIndex((s) => s.id === id);
      const next = [...sections];
      next.splice(idx + 1, 0, cloned);
      onChange(next);
    },
    [sections, onChange]
  );

  const addSection = useCallback(
    (type: "grid" | "paragraph") => {
      const base: SectionItem =
        type === "grid"
          ? { id: newSectionId(), titleEn: "New Section", titleHi: "", type: "grid", visible: true, fields: [emptyField()] }
          : { id: newSectionId(), titleEn: "New Note", titleHi: "", type: "paragraph", visible: true, fields: [{ id: newFieldId(), labelEn: "New Note", labelHi: "", value: "" }] };
      onChange([...sections, base]);
    },
    [sections, onChange]
  );

  const visibleCount = useMemo(() => sections.filter((s) => s.visible).length, [sections]);

  return (
    <div className="space-y-8">
      {sections.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm text-stone-500">
            <span className="font-semibold text-stone-700">{sections.length}</span> sections · <span className="font-semibold text-stone-700">{visibleCount}</span> visible
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => addSection("grid")} className="btn-dark text-sm px-3 py-1.5">
              <Plus className="w-3.5 h-3.5" /> Detail section
            </button>
            <button type="button" onClick={() => addSection("paragraph")} className="btn-outline text-sm px-3 py-1.5">
              <Plus className="w-3.5 h-3.5" /> Text note
            </button>
            {onResetDefaults && (
              <button type="button" onClick={onResetDefaults} className="icon-btn text-stone-400 hover:text-stone-600" title="Reset to defaults">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {sections.length === 0 ? (
        <EmptyState onAddGrid={() => addSection("grid")} onAddText={() => addSection("paragraph")} />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sections.map((section) => (
                <SortableSectionCard
                  key={section.id}
                  section={section}
                  onChange={(patch) => updateSection(section.id, patch)}
                  onDelete={() => deleteSection(section.id)}
                  onDuplicate={() => duplicateSection(section.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {sections.length > 0 && (
        <p className="text-xs text-stone-400 flex items-center gap-1.5">
          <GripVertical className="w-3 h-3" /> Drag sections to reorder. Use the eye icon to hide without deleting.
        </p>
      )}
    </div>
  );
}