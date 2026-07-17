// ---------------------------------------------------------------------------
// Types for the Job Directory screen (Job Team + Directory grid).
// ---------------------------------------------------------------------------

import type { Option } from "./job";

/** A job-team role (e.g. Project Director). `*` roles are mandatory. */
export interface TeamRole {
  key: string;
  label: string;
  required?: boolean;
}

/** roleKey -> selected employee id (0 = none). */
export type JobTeam = Record<string, number>;

/** One row in the Job Directory grid. */
export interface DirectoryEntry {
  id: number;
  organisationTypeId: number;
  organisationId: number;
  contact: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  notes: string;
}

/** Everything stored for one job's directory. */
export interface JobDirectoryData {
  team: JobTeam;
  entries: DirectoryEntry[];
}

/** All the dropdown lists the directory screen needs. */
export interface DirectoryLookups {
  employees: Option[];
  organisationTypes: Option[];
  organisations: Option[];
  roles: TeamRole[];
}
