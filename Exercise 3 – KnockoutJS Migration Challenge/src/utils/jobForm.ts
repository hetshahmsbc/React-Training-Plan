// ---------------------------------------------------------------------------
// Helpers that build and convert the job form model.
//
// The KnockoutJS ViewModel did this inline with ~90 `ko.observable(...)`
// assignments in the constructor and another ~60 in editJobItem(). Pulling it
// into pure functions makes the form component tiny and the logic reusable.
// ---------------------------------------------------------------------------

import type { JobFormValues, JobListItem, Option } from "../types/job";
import { lookups } from "../mock/jobsData";

/** Find the id of the option whose label matches `label` (case-insensitive). */
function idFromLabel(options: Option[], label: string | null): number {
  if (!label) return 0;
  const match = options.find((o) => o.label.toLowerCase() === label.toLowerCase());
  return match ? match.id : 0;
}

/** Find the label for a given option id (used when saving back to the list). */
export function labelFromId(options: Option[], id: number): string {
  const match = options.find((o) => o.id === id);
  return match ? match.label : "";
}

/** A brand-new, empty job — the React version of the ViewModel constructor. */
export function createEmptyJobForm(nextJobNumber: string): JobFormValues {
  return {
    jobId: 0,
    jobNumber: nextJobNumber,
    projectName: "",
    contractTypeId: 0,
    formOfContractId: 0,
    tenderId: 0,
    clientId: 0,
    statusId: 0,
    sectorIds: [],
    defectsLiabilityPeriodId: 0,
    projectInsuranceId: 0,
    contractValue: 0,
    finalAccountValue: 0,
    ladPerWeek: 0,
    loiValue: 0,
    retention: null,
    professionalIndemnity: null,
    employersLiability: null,
    publicLiability: null,
    contractsAllRisk: null,
    projectAddress: "",
    projectAddress2: "",
    city: "",
    postCode: "",
    clientPONr: "",
    startDate: null,
    completionDate: null,
    calendarWeeks: "",
    practicalCompletionDate: null,
    forecastCompletionDate: null,
    endOfDLPDate: null,
    eotGrantToDate: null,
    retentionDueDate: null,
    isLOI: false,
    loiExpiryDate: null,
    isSectionOneComplete: false,
    sectionOneCompletionDate: null,
    sectionOneName: "",
    isSectionTwoComplete: false,
    sectionTwoCompletionDate: null,
    sectionTwoName: "",
    isSectionThreeComplete: false,
    sectionThreeCompletionDate: null,
    sectionThreeName: "",
    descriptionOfWork: "",
    jobApprovalStatus: "Draft",
  };
}

/**
 * Build the full editable form for an existing job: start from the list row,
 * resolve dropdown ids from the display labels, then layer any richer detail
 * overrides (address, insurances, sections…) on top.
 */
export function buildJobForm(list: JobListItem, detail: Partial<JobFormValues>): JobFormValues {
  const base = createEmptyJobForm(list.jobNumber);

  const fromList: JobFormValues = {
    ...base,
    jobId: list.jobId,
    jobNumber: list.jobNumber,
    projectName: list.projectName,
    contractTypeId: idFromLabel(lookups.contractTypes, list.contractType),
    formOfContractId: idFromLabel(lookups.formOfContracts, list.formOfContract),
    clientId: idFromLabel(lookups.clients, list.clientName),
    statusId: idFromLabel(lookups.statuses, list.status),
    contractValue: list.contractValue ?? 0,
    finalAccountValue: list.finalAccountValue ?? 0,
    retention: list.retention,
    projectAddress: list.projectAddress,
    startDate: list.startDate,
    completionDate: list.completionDate,
    calendarWeeks: list.calendarWeeks,
    practicalCompletionDate: list.practicalCompletionDate,
    forecastCompletionDate: list.forecastCompletionDate,
    isLOI: list.loiValue !== null,
    loiValue: list.loiValue ?? 0,
    loiExpiryDate: list.loiExpiryDate,
    jobApprovalStatus: list.jobApprovalStatus,
  };

  return { ...fromList, ...detail };
}

/**
 * Derive the grid row from a saved form (dropdown ids -> display labels).
 * The C# `SaveJob` did this server-side; here we do it before writing to the
 * in-memory list so the table reflects the edit immediately.
 */
export function toListItem(values: JobFormValues): JobListItem {
  return {
    jobId: values.jobId,
    jobNumber: values.jobNumber,
    projectName: values.projectName.trim(),
    contractType: labelFromId(lookups.contractTypes, values.contractTypeId),
    status: labelFromId(lookups.statuses, values.statusId),
    jobApprovalStatus: values.jobApprovalStatus,
    clientName: labelFromId(lookups.clients, values.clientId),
    projectAddress: values.projectAddress.trim(),
    startDate: values.startDate,
    completionDate: values.completionDate,
    calendarWeeks: values.calendarWeeks,
    contractValue: values.contractValue || null,
    finalAccountValue: values.finalAccountValue || null,
    practicalCompletionDate: values.practicalCompletionDate,
    formOfContract: labelFromId(lookups.formOfContracts, values.formOfContractId),
    retention: values.retention,
    loiValue: values.isLOI ? values.loiValue : null,
    loiExpiryDate: values.isLOI ? values.loiExpiryDate : null,
    forecastCompletionDate: values.forecastCompletionDate,
  };
}
