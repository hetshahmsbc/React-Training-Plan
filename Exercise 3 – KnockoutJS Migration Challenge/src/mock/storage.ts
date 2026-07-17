// ---------------------------------------------------------------------------
// Tiny localStorage persistence for the mock data.
//
// Without this the mock lives only in memory, so a full page reload throws
// away any Add / Edit / Delete. Persisting to localStorage makes the demo's
// CRUD survive a refresh — but note this is still LOCAL to the browser and
// never reaches the real Northvale backend. (Swap jobsApi for real fetch
// calls to persist to the actual system.)
// ---------------------------------------------------------------------------

/** Read a persisted value, or return `fallback` if missing / unparseable. */
export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Persist a value (ignored if storage is unavailable, e.g. private mode). */
export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no-op
  }
}
