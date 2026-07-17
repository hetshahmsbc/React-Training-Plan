// ---------------------------------------------------------------------------
// useJobsList — the list-screen's data logic.
//
// Replaces Jobs.js `bindJobListGrid()`: fetch on load, re-fetch when the
// status filter changes, and expose a manual refresh (the Refresh toolbar
// button). React re-renders the table automatically — no DestroyGrid / rebind.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useState } from "react";
import type { JobListItem } from "../types/job";
import { getJobsList } from "../api/jobsApi";

export function useJobsList(statusId: number) {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getJobsList(statusId)
      .then((res) => {
        if (res.error === 0) {
          setJobs(res.data);
          setError(null);
        } else {
          setError(res.message);
        }
      })
      .catch(() => setError("Something went wrong while loading jobs."))
      .finally(() => setLoading(false));
  }, [statusId]);

  useEffect(() => {
    load();
  }, [load]);

  return { jobs, loading, error, refresh: load };
}
