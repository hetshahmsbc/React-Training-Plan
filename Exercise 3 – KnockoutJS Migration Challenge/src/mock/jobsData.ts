// ---------------------------------------------------------------------------
// Mock data source.
//
// Seeded from the real Northvale "Jobs" screen so the migrated app looks and
// behaves like the original. Shapes match the C# `JobList` / `JobMaster`
// entities. `src/api/jobsApi.ts` reads and mutates these arrays, so Add / Edit
// / Delete work in-session (state resets on a full page reload).
//
// To go live, swap jobsApi.ts for real fetch calls — nothing here changes.
// ---------------------------------------------------------------------------

import type {
  JobApprovalStatus,
  JobFormValues,
  JobListItem,
  JobLookups,
  StatusFilterOption,
} from "../types/job";

// ---- Status filter above the list (was `statusSource` in Jobs.js) ---------
// value 1 = ALL; the rest match the C# StatusId values passed to getjobslist.
export const STATUS_FILTERS: StatusFilterOption[] = [
  { value: 1, label: "ALL" },
  { value: 2, label: "Live" },
  { value: 3, label: "DLP" },
  { value: 4, label: "Completed" },
  { value: 5, label: "On Hold" },
  { value: 8, label: "Submitted" },
];

// ---- Dropdown lookups (were separate DB tables in the C# app) -------------

export const lookups: JobLookups = {
  tenders: [
    { id: 0, label: "Select Tender" },
    { id: 101, label: "TEN-2018-014 — Wimbledon Residential" },
    { id: 102, label: "TEN-2018-021 — Golders Green Mixed Use" },
  ],
  clients: [
    { id: 0, label: "Select Client" },
    { id: 201, label: "Jbd Properties Ltd" },
    { id: 202, label: "Private - Tbc" },
    { id: 203, label: "Marcus Beale Architects Ltd" },
    { id: 204, label: "Edequin Limited" },
    { id: 205, label: "Legal & General" },
    { id: 206, label: "Bw Interiors Ltd" },
    { id: 207, label: "Thirdway Contracts" },
    { id: 208, label: "Westgreen Construction Ltd" },
    { id: 209, label: "Vinci Construction Uk Ltd" },
    { id: 210, label: "Keeper And Governors Of The Possessions" },
  ],
  statuses: [
    { id: 0, label: "Select Status" },
    { id: 2, label: "Live" },
    { id: 3, label: "DLP" },
    { id: 4, label: "Completed" },
    { id: 5, label: "On Hold" },
    { id: 8, label: "Submitted" },
  ],
  sectors: [
    { id: 1, label: "Residential" },
    { id: 2, label: "Commercial" },
    { id: 3, label: "Education" },
    { id: 4, label: "Healthcare" },
    { id: 5, label: "Industrial" },
  ],
  formOfContracts: [
    { id: 0, label: "Select Form Of Contract" },
    { id: 11, label: "JCT 2011 - Design and Build Contract (DB)" },
    { id: 12, label: "JCT 2011 - Intermediate Building Contract with contractor's design" },
    { id: 13, label: "JCT 2016 - Intermediate Building Contract with contractor's design" },
    { id: 14, label: "JCT 2016 - Design and Build Contract (DB)" },
    { id: 15, label: "JCT 2016 - Minor Works Building Contract" },
    { id: 16, label: "JCT 2016 - Standard Building Contract" },
    { id: 17, label: "Bespoke Main Contract" },
    { id: 18, label: "Letter Of Intent" },
  ],
  contractTypes: [
    { id: 0, label: "Select Division" },
    { id: 21, label: "Main Contract" },
    { id: 22, label: "Sub Contract" },
  ],
  defectsLiabilityPeriods: [
    { id: 0, label: "Select Defects Liability Period" },
    { id: 31, label: "6 months" },
    { id: 32, label: "12 months" },
    { id: 33, label: "24 months" },
  ],
  projectInsurances: [
    { id: 0, label: "Select Project Insurance" },
    { id: 41, label: "Contractor's All Risk" },
    { id: 42, label: "Employer Provided" },
  ],
  retentionValues: [
    { id: 0, label: "Select Retention" },
    { id: 1.5, label: "1.50%" },
    { id: 3, label: "3.00%" },
    { id: 5, label: "5.00%" },
  ],
  insuranceValues: [
    { id: 0, label: "Select Value" },
    { id: 1000000, label: "£1,000,000.00" },
    { id: 2000000, label: "£2,000,000.00" },
    { id: 5000000, label: "£5,000,000.00" },
    { id: 10000000, label: "£10,000,000.00" },
  ],
};

// ---- Seed jobs (the real rows from the Northvale Jobs screen) -------------

const REAL_JOBS: JobListItem[] = [
  {
    jobId: 263, jobNumber: "263", projectName: "Bushey Flats", contractType: "Main Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Jbd Properties Ltd",
    projectAddress: "170 - 172 High Road, Bushey, WD23 1NP", startDate: "2017-06-16",
    completionDate: null, calendarWeeks: "", contractValue: 3923171.4, finalAccountValue: 3881258,
    practicalCompletionDate: "2019-04-01", formOfContract: "JCT 2011 - Design and Build Contract (DB)",
    retention: 1.5, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2019-01-31",
  },
  {
    jobId: 270, jobNumber: "270", projectName: "Hartsbourne Road (Bushey House)", contractType: "Main Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Private - Tbc",
    projectAddress: "2A Hartsbourne Road, Bushey Heath, WD23 1JH", startDate: "2017-10-09",
    completionDate: "2018-07-27", calendarWeeks: "42 weeks", contractValue: 532000, finalAccountValue: 520119.14,
    practicalCompletionDate: "2018-07-27",
    formOfContract: "JCT 2011 - Intermediate Building Contract with contractor's design",
    retention: 1.5, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2018-06-29",
  },
  {
    jobId: 274, jobNumber: "274", projectName: "4 Alan Road, Wimbledon", contractType: "Main Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Marcus Beale Architects Ltd",
    projectAddress: "4 Alan Road, Wimbledon, SW19 7PT", startDate: "2017-11-20",
    completionDate: "2018-08-10", calendarWeeks: "38 weeks", contractValue: 1505814.74, finalAccountValue: 1576068.51,
    practicalCompletionDate: "2018-10-26",
    formOfContract: "JCT 2016 - Intermediate Building Contract with contractor's design",
    retention: 5, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2018-10-26",
  },
  {
    jobId: 284, jobNumber: "284", projectName: "Church Walk House", contractType: "Main Contract",
    status: "DLP", jobApprovalStatus: "Approved", clientName: "Edequin Limited",
    projectAddress: "Church Walk, Golders Green, NW2 2TJ, London, NW2 2TJ", startDate: "2018-06-18",
    completionDate: "2020-02-14", calendarWeeks: "87 weeks", contractValue: 12455196.05, finalAccountValue: 13436536,
    practicalCompletionDate: "2020-09-20", formOfContract: "Letter Of Intent",
    retention: 3, loiValue: 180, loiExpiryDate: "2026-06-22", forecastCompletionDate: "2020-04-30",
  },
  {
    jobId: 286, jobNumber: "286", projectName: "1 Berkeley Square", contractType: "Sub Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Legal & General",
    projectAddress: "1 Berkeley Street, London, W1J 8DJ", startDate: "2018-11-12",
    completionDate: "2018-11-26", calendarWeeks: "2 weeks", contractValue: 14400, finalAccountValue: 37000,
    practicalCompletionDate: "2018-08-21", formOfContract: "",
    retention: null, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2018-12-04",
  },
  {
    jobId: 287, jobNumber: "287", projectName: "Harella House", contractType: "Sub Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Bw Interiors Ltd",
    projectAddress: "Goswell Road, London, EC1V 7RD", startDate: "2018-09-10",
    completionDate: "2019-02-01", calendarWeeks: "21 weeks", contractValue: 1581195, finalAccountValue: 2002638.5,
    practicalCompletionDate: "2020-01-24", formOfContract: "JCT 2016 - Design and Build Contract (DB)",
    retention: 3, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2018-12-06",
  },
  {
    jobId: 288, jobNumber: "288", projectName: "Great West House", contractType: "Sub Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Bw Interiors Ltd",
    projectAddress: "Great West Road, Brentford, TW8 9DF", startDate: "2018-08-20",
    completionDate: "2018-09-17", calendarWeeks: "4 weeks", contractValue: 51758.2, finalAccountValue: 63500,
    practicalCompletionDate: "2018-12-08", formOfContract: "",
    retention: null, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2018-12-15",
  },
  {
    jobId: 289, jobNumber: "289", projectName: "The Hawker Building", contractType: "Main Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Legal & General",
    projectAddress: "The Heights, Weybridge, KT13 0NY", startDate: "2018-10-08",
    completionDate: "2018-11-26", calendarWeeks: "7 weeks", contractValue: 124762.5, finalAccountValue: 166642,
    practicalCompletionDate: "2018-12-23", formOfContract: "",
    retention: null, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2018-11-26",
  },
  {
    jobId: 291, jobNumber: "291", projectName: "Fidelity", contractType: "Sub Contract",
    status: "Live", jobApprovalStatus: "Approved", clientName: "Bw Interiors Ltd",
    projectAddress: "Beech Gate, Millfield Lane, Lower Kingswood, Tadworth, KT20 6RP", startDate: "2018-09-29",
    completionDate: "2019-11-30", calendarWeeks: "61 weeks", contractValue: 56705, finalAccountValue: 350080,
    practicalCompletionDate: "2019-05-22", formOfContract: "Bespoke Main Contract",
    retention: 5, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2019-11-30",
  },
  {
    jobId: 293, jobNumber: "293", projectName: "Brook house", contractType: "Sub Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Legal & General",
    projectAddress: "Brook House, Shepards Bush Road, Hammersmith, London, W6 7AN", startDate: "2019-05-28",
    completionDate: "2019-08-29", calendarWeeks: "14 weeks", contractValue: 83966, finalAccountValue: 125682.5,
    practicalCompletionDate: "2019-06-07", formOfContract: "JCT 2016 - Minor Works Building Contract",
    retention: 5, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2019-07-07",
  },
  {
    jobId: 295, jobNumber: "295", projectName: "Keen House", contractType: "Sub Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Thirdway Contracts",
    projectAddress: "Keen House, Building A1, Wavedon Business Park, Milton Keynes", startDate: "2019-03-04",
    completionDate: "2019-06-04", calendarWeeks: "14 weeks", contractValue: 122351.16, finalAccountValue: 187700,
    practicalCompletionDate: "2019-10-31",
    formOfContract: "JCT 2016 - Intermediate Building Contract with contractor's design",
    retention: 3, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2019-10-23",
  },
  {
    jobId: 298, jobNumber: "298", projectName: "15 Carlos Place", contractType: "Sub Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Westgreen Construction Ltd",
    projectAddress: "15 Carlos Place, Mayfair, London, W1K", startDate: "2019-04-16",
    completionDate: "2019-04-30", calendarWeeks: "2 weeks", contractValue: 17706, finalAccountValue: 30474.53,
    practicalCompletionDate: "2019-08-09", formOfContract: "Bespoke Main Contract",
    retention: null, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2019-08-09",
  },
  {
    jobId: 299, jobNumber: "299", projectName: "Prentice Place", contractType: "Sub Contract",
    status: "Live", jobApprovalStatus: "Approved", clientName: "Vinci Construction Uk Ltd",
    projectAddress: "Vinci Facilities, Rear of Prentice Place, Harlow, CM17 9BG", startDate: "2019-06-17",
    completionDate: "2020-01-31", calendarWeeks: "33 weeks", contractValue: 78000, finalAccountValue: 33447.7,
    practicalCompletionDate: "2020-01-20", formOfContract: "Bespoke Main Contract",
    retention: 5, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2020-02-29",
  },
  {
    jobId: 300, jobNumber: "300", projectName: "KPMG Reading", contractType: "Sub Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Bw Interiors Ltd",
    projectAddress: "Levels 6 & 7, 2 Forbury Place, Forbury Road, Reading, RG1 3JH", startDate: "2019-07-05",
    completionDate: "2019-08-30", calendarWeeks: "8 weeks", contractValue: 116000, finalAccountValue: 138500,
    practicalCompletionDate: "2019-11-25", formOfContract: "JCT 2016 - Design and Build Contract (DB)",
    retention: 5, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2019-10-09",
  },
  {
    jobId: 301, jobNumber: "301", projectName: "Metro Building", contractType: "Sub Contract",
    status: "On Hold", jobApprovalStatus: "Approved", clientName: "Thirdway Contracts",
    projectAddress: "Metro Building, 1 Butterwick, Hammersmith, London, W6 8DL", startDate: "2019-07-15",
    completionDate: "2020-09-11", calendarWeeks: "61 weeks", contractValue: 113775, finalAccountValue: 295838.5,
    practicalCompletionDate: "2020-05-26", formOfContract: "JCT 2016 - Design and Build Contract (DB)",
    retention: 5, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2020-01-17",
  },
  {
    jobId: 302, jobNumber: "302", projectName: "Druries - Harrow School", contractType: "Main Contract",
    status: "Live", jobApprovalStatus: "Approved", clientName: "Keeper And Governors Of The Possessions",
    projectAddress: "Druries Boarding House, High Street, Harrow on the Hill, HA1", startDate: "2019-08-06",
    completionDate: "2020-08-26", calendarWeeks: "56 weeks", contractValue: 2439854, finalAccountValue: 2857600,
    practicalCompletionDate: "2020-11-09", formOfContract: "JCT 2016 - Standard Building Contract",
    retention: 3, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2020-12-01",
  },
  {
    jobId: 303, jobNumber: "303", projectName: "Anstee House", contractType: "Sub Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Bw Interiors Ltd",
    projectAddress: "Anstee House, Wood Street, Kingston Upon Thames, KT1 1TS", startDate: "2019-08-18",
    completionDate: "2019-10-29", calendarWeeks: "11 weeks", contractValue: 2700, finalAccountValue: 2700,
    practicalCompletionDate: "2019-10-29", formOfContract: "Bespoke Main Contract",
    retention: null, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2019-08-18",
  },
  {
    jobId: 305, jobNumber: "305", projectName: "55 Broadway - TFL", contractType: "Sub Contract",
    status: "Completed", jobApprovalStatus: "Approved", clientName: "Thirdway Contracts",
    projectAddress: "55 Broadway, St Jame's Park, London, SW1H 0BD", startDate: "2019-09-20",
    completionDate: "2019-11-29", calendarWeeks: "10 weeks", contractValue: 154755.11, finalAccountValue: 185096.25,
    practicalCompletionDate: "2020-01-31", formOfContract: "",
    retention: null, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2020-02-29",
  },
  {
    jobId: 306, jobNumber: "306", projectName: "Queen Street, Mayfair", contractType: "Sub Contract",
    status: "Submitted", jobApprovalStatus: "Submitted", clientName: "Thirdway Contracts",
    projectAddress: "6 Queen Street, Mayfair, London, W1J 5PR", startDate: "2019-09-23",
    completionDate: "2019-10-15", calendarWeeks: "4 weeks", contractValue: 47415, finalAccountValue: 93323.83,
    practicalCompletionDate: "2019-12-24", formOfContract: "",
    retention: null, loiValue: null, loiExpiryDate: null, forecastCompletionDate: "2020-03-31",
  },
];

// ---- Generated dummy jobs ------------------------------------------------
// Extra volume so pagination / filtering are realistic. Deterministic (no
// randomness) so ids and data are stable across reloads. Every value uses a
// label that exists in `lookups`, so these jobs open and edit correctly too.

const PREFIXES = [
  "Kingswood", "Elm", "Maple", "Ashford", "Bridgewater", "Oakfield", "Highgrove",
  "Waterloo", "Camden", "Belgrave", "Sterling", "Victoria", "Regent", "Clarendon",
  "Hartwell", "Pinewood", "Fairview", "Brookside", "Windsor", "Ashcroft", "Cedar",
  "Marlow", "Grosvenor", "Hollywell", "Langley", "Redcliffe",
];
const SUFFIXES = [
  "House", "Court", "Tower", "Place", "Works", "Gardens", "Wharf", "Studios",
  "Mews", "Plaza", "Quarter", "Building", "Lofts", "Residences", "Park",
];
const CITIES = [
  "London", "Manchester", "Leeds", "Bristol", "Birmingham", "Reading",
  "Brighton", "Sheffield", "Watford", "Croydon", "Guildford", "Cambridge",
];
const POSTCODES = [
  "SW1 2AA", "EC1 3BB", "W1 4CC", "N1 5DD", "SE1 6EE", "M4 7FF",
  "LS1 8GG", "BS1 9HH", "RG1 1JJ", "GU1 2KK", "CB1 3LL", "OX1 4MM",
];

/** Add whole days to an ISO date, staying in UTC to avoid timezone drift. */
function isoAddDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d) + days * 86400000);
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${mm}-${dd}`;
}

function generateDummyJobs(count: number, startId: number): JobListItem[] {
  const clients = lookups.clients.filter((c) => c.id !== 0).map((c) => c.label);
  const forms = lookups.formOfContracts.filter((f) => f.id !== 0).map((f) => f.label);
  const divisions = ["Main Contract", "Sub Contract"];
  const statuses = ["Live", "DLP", "Completed", "On Hold", "Submitted"];
  const retentions: (number | null)[] = [1.5, 3, 5, null];
  const approvals: JobApprovalStatus[] = ["Approved", "Approved", "Submitted", "Draft"];

  const out: JobListItem[] = [];
  for (let i = 0; i < count; i++) {
    const id = startId + i;
    const prefix = PREFIXES[i % PREFIXES.length];
    const suffix = SUFFIXES[(i * 5) % SUFFIXES.length];
    const city = CITIES[i % CITIES.length];
    const postcode = POSTCODES[i % POSTCODES.length];
    const status = statuses[i % statuses.length];
    const form = forms[(i * 3) % forms.length];
    const retention = retentions[i % retentions.length];

    const year = 2020 + (i % 6);
    const month = String((i % 12) + 1).padStart(2, "0");
    const startDate = `${year}-${month}-05`;
    const weeks = 8 + ((i * 7) % 70);
    const completionDate = isoAddDays(startDate, weeks * 7);
    const contractValue = 75000 + ((i * 173) % 240) * 25000;
    const isDone = status === "Completed" || status === "DLP";
    const isLoi = form === "Letter Of Intent";

    out.push({
      jobId: id,
      jobNumber: String(id),
      projectName: `${prefix} ${suffix}`,
      contractType: divisions[i % 2],
      status,
      jobApprovalStatus: approvals[i % approvals.length],
      clientName: clients[i % clients.length],
      projectAddress: `${(i % 180) + 1} ${prefix} Road, ${city}, ${postcode}`,
      startDate,
      completionDate,
      calendarWeeks: `${weeks} weeks`,
      contractValue,
      finalAccountValue: isDone ? Math.round(contractValue * 1.04) : null,
      practicalCompletionDate: isoAddDays(completionDate, 14),
      formOfContract: form,
      retention,
      loiValue: isLoi ? 100000 + (i % 5) * 50000 : null,
      loiExpiryDate: isLoi ? isoAddDays(startDate, 30) : null,
      forecastCompletionDate: isoAddDays(completionDate, 21),
    });
  }
  return out;
}

/** All seed jobs: the 19 real rows plus 50 generated dummies (ids 307–356). */
export const seedJobs: JobListItem[] = [...REAL_JOBS, ...generateDummyJobs(50, 307)];

/**
 * Full editable detail for specific jobs (was the JobDetail record loaded on
 * Edit). Job 274 mirrors the real "Edit Job" screen exactly; others fall back
 * to values derived from the list row. Keyed by jobId.
 */
export const seedJobDetails: Record<number, Partial<JobFormValues>> = {
  274: {
    tenderId: 0,
    clientId: 203,
    statusId: 4,
    contractTypeId: 21,
    formOfContractId: 13,
    defectsLiabilityPeriodId: 32,
    projectInsuranceId: 0,
    sectorIds: [1],
    contractValue: 1505814.74,
    retention: 5,
    projectAddress: "4 Alan Road",
    projectAddress2: "Wimbledon",
    city: "Wimbledon",
    postCode: "SW19 7PT",
    clientPONr: "",
    startDate: "2017-11-20",
    completionDate: "2018-08-10",
    calendarWeeks: "38 weeks",
    practicalCompletionDate: "2018-10-26",
    forecastCompletionDate: "2018-10-26",
    endOfDLPDate: "2019-10-25",
    eotGrantToDate: "2018-10-26",
    retentionDueDate: "2020-01-25",
    finalAccountValue: 1576068.51,
    ladPerWeek: 1000,
    employersLiability: 10000000,
    publicLiability: 10000000,
    professionalIndemnity: 1000000,
    contractsAllRisk: 2000000,
    descriptionOfWork: "",
  },
  284: {
    clientId: 204,
    statusId: 3,
    contractTypeId: 21,
    formOfContractId: 18,
    sectorIds: [2],
    contractValue: 12455196.05,
    retention: 3,
    isLOI: true,
    loiValue: 180,
    loiExpiryDate: "2026-06-22",
    projectAddress: "Church Walk",
    projectAddress2: "Golders Green",
    city: "London",
    postCode: "NW2 2TJ",
    startDate: "2018-06-18",
    completionDate: "2020-02-14",
    descriptionOfWork: "New build residential scheme in Golders Green under a Letter of Intent.",
  },
};
