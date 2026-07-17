// ---------------------------------------------------------------------------
// Job Directory "API" — Job Team + Directory grid, persisted per job.
//
// In the real app this was several endpoints on JobsContextResponseController.
// Here it reads/writes a localStorage-backed store keyed by jobId.
// ---------------------------------------------------------------------------

import type { DirectoryLookups, JobDirectoryData } from "../types/directory";
import { createEmptyTeam, directoryLookups } from "../mock/directoryData";
import { loadState, saveState } from "../mock/storage";
import { ok, simulateLatency, type ApiResult } from "./client";

const KEY = "nv_job_directory_v1";

let store: Record<number, JobDirectoryData> = loadState(KEY, {});

export interface JobDirectoryResult {
  data: JobDirectoryData;
  lookups: DirectoryLookups;
}

/** Load a job's team + directory (empty defaults if it has none yet). */
export async function getJobDirectory(jobId: number): Promise<ApiResult<JobDirectoryResult>> {
  await simulateLatency();
  const data = store[jobId] ?? { team: createEmptyTeam(), entries: [] };
  return ok({ data, lookups: directoryLookups });
}

/** Save a job's team + directory. */
export async function saveJobDirectory(
  jobId: number,
  data: JobDirectoryData,
): Promise<ApiResult<number>> {
  await simulateLatency();
  store = { ...store, [jobId]: data };
  saveState(KEY, store);
  return ok(jobId, "Job directory saved successfully.");
}
