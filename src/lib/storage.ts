import { SavedBiodata, BiodataDocument } from "./types";

const KEY = "biodata-builder:profiles";
const DRAFT_KEY = "biodata-builder:draft";

function isValidSavedBiodata(p: unknown): p is SavedBiodata {
  if (!p || typeof p !== "object") return false;
  const doc = (p as SavedBiodata).doc as BiodataDocument | undefined;
  return (
    typeof (p as SavedBiodata).id === "string" &&
    !!doc &&
    typeof doc === "object" &&
    Array.isArray(doc.sections)
  );
}

export function loadProfiles(): SavedBiodata[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Silently drop any entries saved by an older, incompatible version of
    // the data model (e.g. before dynamic sections were introduced).
    const valid = parsed.filter(isValidSavedBiodata);
    if (valid.length !== parsed.length) {
      saveProfiles(valid);
    }
    return valid;
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: SavedBiodata[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(profiles));
}

export function upsertProfile(profile: SavedBiodata) {
  const profiles = loadProfiles();
  const idx = profiles.findIndex((p) => p.id === profile.id);
  if (idx >= 0) {
    profiles[idx] = profile;
  } else {
    profiles.unshift(profile);
  }
  saveProfiles(profiles);
  return profiles;
}

export function deleteProfile(id: string) {
  const profiles = loadProfiles().filter((p) => p.id !== id);
  saveProfiles(profiles);
  return profiles;
}

export function saveDraft<T>(data: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

export function loadDraft<T>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
