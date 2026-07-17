// ---------------------------------------------------------------------------
// Types for the Jobs module.
//
// In the original KnockoutJS app these shapes lived only in the C# entities
// (Entities/Jobs.cs) and were completely untyped on the JavaScript side — the
// ViewModel just read `response.Data.JobList` and hoped the fields existed.
// Here we describe them once, in TypeScript, so the editor and compiler catch
// mistakes for us.
// ---------------------------------------------------------------------------

/** The approval workflow a job moves through (was JobApprovalStatusId 1/2/3). */
export type JobApprovalStatus = "Draft" | "Submitted" | "Approved";

/** A simple {id, label} pair used by every dropdown on the form. */
export interface Option {
  id: number;
  label: string;
}

/**
 * One row in the jobs list grid.
 * Mirrors the C# `JobList` entity (only the columns the grid actually shows).
 */
export interface JobListItem {
  jobId: number;
  jobNumber: string;
  projectName: string;
  contractType: string; // shown as the "Division" column
  status: string; // Live / DLP / Completed / On Hold / Submitted
  jobApprovalStatus: JobApprovalStatus;
  clientName: string;
  projectAddress: string;
  startDate: string | null; // ISO date string "yyyy-MM-dd"
  completionDate: string | null;
  calendarWeeks: string;
  contractValue: number | null;
  finalAccountValue: number | null;
  practicalCompletionDate: string | null;
  formOfContract: string;
  retention: number | null;
  loiValue: number | null;
  loiExpiryDate: string | null;
  forecastCompletionDate: string | null;
}

/**
 * The full editable job record used by the Add / Edit form.
 * Mirrors the C# `JobMaster` entity (the fields the screen actually edits).
 */
export interface JobFormValues {
  jobId: number;
  jobNumber: string;
  projectName: string;

  // Dropdown selections (store the id; the label comes from a lookup list)
  contractTypeId: number; // Division
  formOfContractId: number;
  tenderId: number;
  clientId: number;
  statusId: number;
  sectorIds: number[]; // multi-select
  defectsLiabilityPeriodId: number;
  projectInsuranceId: number;

  // Money
  contractValue: number;
  finalAccountValue: number;
  ladPerWeek: number; // Liquidated & Ascertained Damages per week
  loiValue: number;

  // Insurance dropdowns (value in £, or null when "not selected")
  retention: number | null; // stored as a % value
  professionalIndemnity: number | null;
  employersLiability: number | null; // was `productLiability`
  publicLiability: number | null;
  contractsAllRisk: number | null;

  // Address
  projectAddress: string;
  projectAddress2: string;
  city: string;
  postCode: string;
  clientPONr: string;

  // Dates (ISO "yyyy-MM-dd" or null)
  startDate: string | null;
  completionDate: string | null;
  calendarWeeks: string; // computed from start + completion
  practicalCompletionDate: string | null;
  forecastCompletionDate: string | null;
  endOfDLPDate: string | null; // computed from PC date
  eotGrantToDate: string | null;
  retentionDueDate: string | null; // computed from PC date

  // Letter of Intent
  isLOI: boolean;
  loiExpiryDate: string | null;

  // The three "section complete" toggles + their date + name
  isSectionOneComplete: boolean;
  sectionOneCompletionDate: string | null;
  sectionOneName: string;
  isSectionTwoComplete: boolean;
  sectionTwoCompletionDate: string | null;
  sectionTwoName: string;
  isSectionThreeComplete: boolean;
  sectionThreeCompletionDate: string | null;
  sectionThreeName: string;

  descriptionOfWork: string;
  jobApprovalStatus: JobApprovalStatus;
}

/** All the dropdown lists the form needs, fetched together (was one API call). */
export interface JobLookups {
  tenders: Option[];
  clients: Option[];
  statuses: Option[];
  sectors: Option[];
  formOfContracts: Option[];
  contractTypes: Option[]; // Divisions
  defectsLiabilityPeriods: Option[];
  projectInsurances: Option[];
  retentionValues: Option[];
  insuranceValues: Option[]; // shared by the 4 insurance dropdowns
}

/** The status filter above the list (was `statusSource` in Jobs.js). */
export interface StatusFilterOption {
  value: number;
  label: string;
}
