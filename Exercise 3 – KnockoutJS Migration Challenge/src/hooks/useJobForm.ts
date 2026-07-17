// ---------------------------------------------------------------------------
// useJobForm — the Add/Edit form's brain.
//
// Replaces the JobsAddEdit ViewModel: it loads the job, holds every field in
// one typed object, recomputes the derived fields (calendar weeks, DLP/
// retention dates) whenever their inputs change, validates on save, and calls
// the API. The form component just renders values and calls setField().
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useState } from "react";
import type { JobFormValues, JobLookups } from "../types/job";
import { getJob, saveJob } from "../api/jobsApi";
import { addMonths, addYears, diffWeeks } from "../utils/format";

export type JobFormErrors = Partial<Record<keyof JobFormValues, string>>;

/**
 * Re-derive the read-only fields after a change. Mirrors the ViewModel's
 * setDateCalculation / setPCDateCalculation / LOI-checkbox handlers.
 */
function applyDerived(form: JobFormValues, changedKey: keyof JobFormValues): JobFormValues {
  let next = form;

  // Calendar Weeks = whole weeks between Start and Completion (min 1).
  if (changedKey === "startDate" || changedKey === "completionDate") {
    const hasBoth = Boolean(next.startDate && next.completionDate);
    const weeks = diffWeeks(next.startDate, next.completionDate);
    next = { ...next, calendarWeeks: hasBoth ? `${weeks === 0 ? 1 : weeks} Weeks` : "" };
  }

  // P C Date drives End of DLP (+1 year) and Retention Due (+1 year +2 months).
  if (changedKey === "practicalCompletionDate") {
    if (next.practicalCompletionDate) {
      const endOfDLP = addYears(next.practicalCompletionDate, 1);
      next = { ...next, endOfDLPDate: endOfDLP, retentionDueDate: addMonths(endOfDLP, 2) };
    } else {
      next = { ...next, endOfDLPDate: null, retentionDueDate: null };
    }
  }

  // Turning LOI off clears its (now disabled) fields.
  if (changedKey === "isLOI" && !next.isLOI) {
    next = { ...next, loiValue: 0, loiExpiryDate: null };
  }

  return next;
}

/** The validation rules that blocked Save in the original saveJobs(). */
function validate(form: JobFormValues): JobFormErrors {
  const errors: JobFormErrors = {};

  if (form.projectName.trim().length === 0) {
    errors.projectName = "Project Name is required.";
  }
  if (form.clientId === 0) {
    errors.clientId = "Please select a Client Name.";
  }
  if (!form.startDate) {
    errors.startDate = "Start Date is required.";
  }
  if (form.isLOI && (!form.loiValue || form.loiValue <= 0)) {
    errors.loiValue = "Please enter an LOI Value.";
  }
  if (form.isLOI && !form.loiExpiryDate) {
    errors.loiExpiryDate = "Please select an LOI Expiry Date.";
  }

  return errors;
}

export function useJobForm(jobId: number) {
  const [form, setForm] = useState<JobFormValues | null>(null);
  const [lookups, setLookups] = useState<JobLookups | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<JobFormErrors>({});

  // Load the job (or a blank form for Add) once, when the id changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    getJob(jobId).then((res) => {
      if (!active) return;
      setForm(res.data.form);
      setLookups(res.data.lookups);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [jobId]);

  const setField = useCallback(
    <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => {
      setForm((prev) => (prev ? applyDerived({ ...prev, [key]: value }, key) : prev));
      // Clear a field's error as soon as the user edits it.
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    },
    [],
  );

  /** Toggle one sector id in the multi-select (was jqxComboBox checkItem). */
  const toggleSector = useCallback((sectorId: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      const has = prev.sectorIds.includes(sectorId);
      return {
        ...prev,
        sectorIds: has
          ? prev.sectorIds.filter((id) => id !== sectorId)
          : [...prev.sectorIds, sectorId],
      };
    });
  }, []);

  /** Validate then save. Resolves to the saved job id, or null if invalid. */
  const save = useCallback(async (): Promise<number | null> => {
    if (!form) return null;

    const found = validate(form);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return null;

    setSaving(true);
    try {
      const res = await saveJob(form);
      return res.error === 0 ? res.data : null;
    } finally {
      setSaving(false);
    }
  }, [form]);

  const isEdit = useMemo(() => jobId > 0, [jobId]);

  return { form, lookups, loading, saving, errors, isEdit, setField, toggleSector, save };
}
