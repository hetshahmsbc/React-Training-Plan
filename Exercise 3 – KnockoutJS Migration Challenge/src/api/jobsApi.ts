// ---------------------------------------------------------------------------
// Jobs "API".
//
// One function per endpoint the original screen used:
//   getJobsList  <-  GET  api/Jobs/getjobslist
//   getJob       <-  (part of) editJobItem() load
//   saveJob      <-  POST api/Jobs/savejobs
//   deleteJob    <-  POST api/Jobs/deletejob
//
// State is kept in memory AND mirrored to localStorage, so Add / Edit / Delete
// survive a page reload. Two stores are kept:
//   • `jobs`    — the list rows (grid)
//   • `details` — the full edited form per job, so re-opening a job shows
//                 exactly what you last saved (not just the list columns)
//
// This is all LOCAL to the browser. To persist to the real system, replace
// each body with a real `fetch(...)` returning the same ApiResult<T>.
// ---------------------------------------------------------------------------

import type { JobFormValues, JobListItem, JobLookups } from "../types/job";
import { lookups, seedJobDetails, seedJobs } from "../mock/jobsData";
import { loadState, saveState } from "../mock/storage";
import { buildJobForm, createEmptyJobForm, toListItem } from "../utils/jobForm";
import { ok, simulateLatency, type ApiResult } from "./client";

// v2: bumped when the seed data set changed (added 50 dummy jobs), so existing
// browsers pick up the new seed instead of a stale v1 snapshot.
const JOBS_KEY = "nv_jobs_v2";
const DETAILS_KEY = "nv_job_details_v2";

let jobs: JobListItem[] = loadState(
  JOBS_KEY,
  seedJobs.map((j) => ({ ...j })),
);
let details: Record<number, JobFormValues> = loadState(DETAILS_KEY, {});

function persist() {
  saveState(JOBS_KEY, jobs);
  saveState(DETAILS_KEY, details);
}

/** Detail payload the Edit page needs: the form values + all dropdown lists. */
export interface JobEditData {
  form: JobFormValues;
  lookups: JobLookups;
}

/** List, filtered by the status dropdown. statusId 1 = "ALL" (was Jobs.js). */
export async function getJobsList(statusId: number): Promise<ApiResult<JobListItem[]>> {
  await simulateLatency();
  const all = jobs.map((j) => ({ ...j }));
  if (statusId === 1) return ok(all);

  const wanted = lookups.statuses.find((s) => s.id === statusId)?.label;
  return ok(wanted ? all.filter((j) => j.status === wanted) : all);
}

/** Load one job for editing (id 0 = a fresh Add form with the next job number). */
export async function getJob(jobId: number): Promise<ApiResult<JobEditData>> {
  await simulateLatency();

  if (jobId === 0) {
    return ok({ form: createEmptyJobForm(nextJobNumber()), lookups });
  }

  // Prefer the last saved full form, so edits round-trip completely.
  const saved = details[jobId];
  if (saved) return ok({ form: saved, lookups });

  const list = jobs.find((j) => j.jobId === jobId);
  if (!list) {
    return {
      error: -1,
      message: "Job not found",
      data: { form: createEmptyJobForm(nextJobNumber()), lookups },
    };
  }

  const detail = seedJobDetails[jobId] ?? {};
  return ok({ form: buildJobForm(list, detail), lookups });
}

/** Insert (jobId 0) or update a job. Returns the saved job's id, like SaveJob. */
export async function saveJob(values: JobFormValues): Promise<ApiResult<number>> {
  await simulateLatency();

  if (values.jobId === 0) {
    const newId = Math.max(0, ...jobs.map((j) => j.jobId)) + 1;
    const saved = { ...values, jobId: newId };
    jobs = [toListItem(saved), ...jobs];
    details[newId] = saved;
    persist();
    return ok(newId, "Job data saved successfully.");
  }

  jobs = jobs.map((j) => (j.jobId === values.jobId ? toListItem(values) : j));
  details[values.jobId] = values;
  persist();
  return ok(values.jobId, "Job data saved successfully.");
}

/** Delete a job by id (was POST deletejob { JobId }). */
export async function deleteJob(jobId: number): Promise<ApiResult<number>> {
  await simulateLatency();
  const existed = jobs.some((j) => j.jobId === jobId);
  if (!existed) return { error: -1, message: "Job not found", data: jobId };
  jobs = jobs.filter((j) => j.jobId !== jobId);
  delete details[jobId];
  persist();
  return ok(jobId, "Job deleted successfully.");
}

/** The next job number for a brand new job (was fetched from the DB). */
function nextJobNumber(): string {
  const numbers = jobs
    .map((j) => Number(j.jobNumber.replace(/\D/g, "")))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 300) + 1;
  return String(next);
}
