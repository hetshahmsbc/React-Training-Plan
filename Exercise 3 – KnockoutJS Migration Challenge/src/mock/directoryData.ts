// ---------------------------------------------------------------------------
// Mock data for the Job Directory screen: employees (for the team role
// dropdowns), organisation types + organisations (for the directory grid),
// and helpers to create blank rows.
// ---------------------------------------------------------------------------

import type { DirectoryEntry, DirectoryLookups, JobTeam, TeamRole } from "../types/directory";
import type { Option } from "../types/job";

export const roles: TeamRole[] = [
  { key: "projectDirector", label: "Project Director", required: true },
  { key: "contractsManager", label: "Contracts Manager", required: true },
  { key: "designTechnical", label: "Design & Technical", required: true },
  { key: "projectManager", label: "Project Manager", required: true },
  { key: "siteManager1", label: "Site Manager 1", required: true },
  { key: "siteManager2", label: "Site Manager 2" },
  { key: "foreman", label: "Foreman", required: true },
  { key: "approver", label: "Approver", required: true },
  { key: "quantitySurveyor", label: "Quantity Surveyor", required: true },
  { key: "asstQuantitySurveyor", label: "Asst Quantity Surveyor" },
  { key: "administrator", label: "Administrator", required: true },
  { key: "documentController", label: "Document Controller", required: true },
  { key: "estimator", label: "Estimator" },
];

export const employees: Option[] = [
  { id: 0, label: "Select" },
  { id: 1, label: "David Okafor" },
  { id: 2, label: "Sarah Bennett" },
  { id: 3, label: "James Whitfield" },
  { id: 4, label: "Priya Nair" },
  { id: 5, label: "Michael Ross" },
  { id: 6, label: "Grace Adeyemi" },
  { id: 7, label: "Tom Sullivan" },
  { id: 8, label: "Hannah Clarke" },
  { id: 9, label: "Omar Haddad" },
  { id: 10, label: "Lucy Fenwick" },
];

export const organisationTypes: Option[] = [
  { id: 0, label: "Select Type" },
  { id: 1, label: "Client" },
  { id: 2, label: "Main Contractor" },
  { id: 3, label: "Sub Contractor" },
  { id: 4, label: "Architect" },
  { id: 5, label: "Consultant" },
  { id: 6, label: "Supplier" },
];

export const organisations: Option[] = [
  { id: 0, label: "Select Organisation" },
  { id: 1, label: "Meridian Developments Ltd" },
  { id: 2, label: "Marcus Beale Architects Ltd" },
  { id: 3, label: "Bw Interiors Ltd" },
  { id: 4, label: "Thirdway Contracts" },
  { id: 5, label: "Legal & General" },
  { id: 6, label: "Arup" },
  { id: 7, label: "Gardiner & Theobald" },
  { id: 8, label: "Travis Perkins" },
];

export const directoryLookups: DirectoryLookups = {
  employees,
  organisationTypes,
  organisations,
  roles,
};

/** A team with every role unassigned (id 0). */
export function createEmptyTeam(): JobTeam {
  const team: JobTeam = {};
  roles.forEach((role) => {
    team[role.key] = 0;
  });
  return team;
}

/** A blank directory row with the given id. */
export function createEmptyEntry(id: number): DirectoryEntry {
  return {
    id,
    organisationTypeId: 0,
    organisationId: 0,
    contact: "",
    address: "",
    phone: "",
    mobile: "",
    email: "",
    notes: "",
  };
}
