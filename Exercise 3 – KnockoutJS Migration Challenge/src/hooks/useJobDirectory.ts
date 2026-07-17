// ---------------------------------------------------------------------------
// useJobDirectory — state + operations for the Job Directory screen.
//
// Holds the team assignments and directory rows locally; `save()` persists
// both. Add / update / remove act on local state so the grid feels live.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from "react";
import type { DirectoryEntry, DirectoryLookups, JobTeam } from "../types/directory";
import { createEmptyEntry } from "../mock/directoryData";
import { getJobDirectory, saveJobDirectory } from "../api/directoryApi";

export function useJobDirectory(jobId: number) {
  const [team, setTeam] = useState<JobTeam>({});
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [lookups, setLookups] = useState<DirectoryLookups | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const nextId = useRef(1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getJobDirectory(jobId).then((res) => {
      if (!active) return;
      setTeam(res.data.data.team);
      setEntries(res.data.data.entries);
      setLookups(res.data.lookups);
      nextId.current = res.data.data.entries.reduce((max, e) => Math.max(max, e.id), 0) + 1;
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [jobId]);

  const setRole = useCallback((roleKey: string, employeeId: number) => {
    setTeam((t) => ({ ...t, [roleKey]: employeeId }));
  }, []);

  const addEntry = useCallback(() => {
    setEntries((list) => [...list, createEmptyEntry(nextId.current++)]);
  }, []);

  const updateEntry = useCallback((id: number, patch: Partial<DirectoryEntry>) => {
    setEntries((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const removeEntry = useCallback((id: number) => {
    setEntries((list) => list.filter((e) => e.id !== id));
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    setSaving(true);
    try {
      const res = await saveJobDirectory(jobId, { team, entries });
      return res.error === 0;
    } finally {
      setSaving(false);
    }
  }, [jobId, team, entries]);

  return { team, entries, lookups, loading, saving, setRole, addEntry, updateEntry, removeEntry, save };
}
