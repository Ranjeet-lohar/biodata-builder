"use client";

import { useEffect, useState } from "react";
import { SavedBiodata } from "@/lib/types";
import { loadProfiles, upsertProfile, deleteProfile } from "@/lib/storage";
import { Save, FolderOpen, Trash2, FilePlus2 } from "lucide-react";

export default function ProfilesBar({
  currentId,
  currentName,
  onLoad,
  onNew,
  getSnapshot,
}: {
  currentId: string;
  currentName: string;
  onLoad: (profile: SavedBiodata) => void;
  onNew: () => void;
  getSnapshot: () => Pick<SavedBiodata, "templateId" | "doc">;
}) {
  const [profiles, setProfiles] = useState<SavedBiodata[]>([]);
  const [name, setName] = useState(currentName);
  const [open, setOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration on mount
    setProfiles(loadProfiles());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync local draft name from parent prop
    setName(currentName);
  }, [currentName]);

  function handleSave() {
    const snap = getSnapshot();
    const profile: SavedBiodata = {
      id: currentId,
      name: name?.trim() || "Untitled Biodata",
      templateId: snap.templateId,
      doc: snap.doc,
      updatedAt: Date.now(),
    };
    const updated = upsertProfile(profile);
    setProfiles(updated);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setProfiles(deleteProfile(id));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Biodata name"
        className="field-input-sm w-36 sm:w-40"
      />
      <button onClick={handleSave} className="btn-dark">
        <Save className="w-3.5 h-3.5" />
        {savedFlash ? "Saved!" : "Save"}
      </button>

      <div className="relative">
        <button onClick={() => setOpen((o) => !o)} className="btn-outline">
          <FolderOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">My Biodatas</span> ({profiles.length})
        </button>
        {open && (
          <div className="absolute z-20 top-full mt-1 left-0 w-64 max-h-80 overflow-y-auto bg-white border border-stone-200 rounded-lg shadow-lg py-1">
            {profiles.length === 0 && (
              <p className="text-xs text-stone-400 px-3 py-2">No saved biodatas yet.</p>
            )}
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onLoad(p);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-stone-50 text-sm"
              >
                <span className="truncate">{p.name}</span>
                <Trash2
                  className="w-3.5 h-3.5 text-stone-400 hover:text-[#1e98d7] shrink-0"
                  onClick={(e) => handleDelete(p.id, e)}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={onNew} className="btn-outline">
        <FilePlus2 className="w-3.5 h-3.5" />
        New
      </button>
    </div>
  );
}
