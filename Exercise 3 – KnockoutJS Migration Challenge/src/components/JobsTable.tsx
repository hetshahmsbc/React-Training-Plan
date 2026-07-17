// ---------------------------------------------------------------------------
// JobsTable — React replacement for the jqxGrid on the Jobs list screen.
//
// Same columns as the real grid, but the plumbing is a small typed component:
//   • click a header to sort (asc / desc / off)
//   • a search box filters across the key text columns
//   • click a row to select; double-click to open the job
//   • coloured status pills (was the grid's cellHighlightRenderer)
//   • client-side pagination footer (Show rows / page nav / range)
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import type { JobListItem } from "../types/job";
import { formatCurrency, formatDate, formatPercent } from "../utils/format";
import { Icon } from "./icons";

interface Column {
  key: keyof JobListItem;
  label: string;
  align?: "right";
  render?: (job: JobListItem) => React.ReactNode;
}

// Colour for each job status pill.
const STATUS_CLASS: Record<string, string> = {
  Live: "pill pill--live",
  Completed: "pill pill--done",
  DLP: "pill pill--dlp",
  "On Hold": "pill pill--hold",
  Submitted: "pill pill--submitted",
};

const COLUMNS: Column[] = [
  { key: "projectName", label: "Project Name" },
  { key: "contractType", label: "Division" },
  { key: "jobNumber", label: "Job Nr" },
  {
    key: "status",
    label: "Status",
    render: (j) => <span className={STATUS_CLASS[j.status] ?? "pill"}>{j.status}</span>,
  },
  { key: "clientName", label: "Client Name" },
  { key: "startDate", label: "Start Date", render: (j) => formatDate(j.startDate) },
  { key: "completionDate", label: "Completion Date", render: (j) => formatDate(j.completionDate) },
  { key: "calendarWeeks", label: "Weeks" },
  { key: "contractValue", label: "Contract Value", align: "right", render: (j) => formatCurrency(j.contractValue) },
  {
    key: "practicalCompletionDate",
    label: "Practical Completion Date",
    render: (j) => formatDate(j.practicalCompletionDate),
  },
  { key: "formOfContract", label: "Form Of Contract" },
  { key: "retention", label: "Retention", align: "right", render: (j) => formatPercent(j.retention) },
  { key: "projectAddress", label: "Project Address" },
  {
    key: "finalAccountValue",
    label: "Final Account Value",
    align: "right",
    render: (j) => formatCurrency(j.finalAccountValue),
  },
  { key: "loiExpiryDate", label: "LOI Expiry Date", render: (j) => formatDate(j.loiExpiryDate) },
  { key: "loiValue", label: "LOI Value", align: "right", render: (j) => formatCurrency(j.loiValue) },
  {
    key: "forecastCompletionDate",
    label: "Forecast Completion Date",
    render: (j) => formatDate(j.forecastCompletionDate),
  },
];

const SEARCH_KEYS: (keyof JobListItem)[] = [
  "jobNumber",
  "projectName",
  "clientName",
  "status",
  "contractType",
  "projectAddress",
];

const PAGE_SIZES = [25, 50, 100];
type SortDirection = "asc" | "desc";

interface JobsTableProps {
  jobs: JobListItem[];
  selectedId: number | null;
  onSelect: (jobId: number) => void;
  onOpen: (jobId: number) => void;
}

function compare(a: JobListItem, b: JobListItem, key: keyof JobListItem): number {
  const av = a[key];
  const bv = b[key];
  if (av === null || av === undefined) return -1;
  if (bv === null || bv === undefined) return 1;
  if (typeof av === "number" && typeof bv === "number") return av - bv;
  return String(av).localeCompare(String(bv));
}

export function JobsTable({ jobs, selectedId, onSelect, onOpen }: JobsTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof JobListItem | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? jobs.filter((job) => SEARCH_KEYS.some((k) => String(job[k] ?? "").toLowerCase().includes(term)))
      : jobs;
    if (!sortKey) return filtered;
    const sorted = [...filtered].sort((a, b) => compare(a, b, sortKey));
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [jobs, search, sortKey, sortDir]);

  // Keep the page in range when the row count changes (search/filter/delete).
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [page, pageCount]);

  const start = page * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  function toggleSort(key: keyof JobListItem) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
    }
  }

  function sortIndicator(key: keyof JobListItem): string {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  }

  return (
    <div className="grid">
      <div className="grid__bar">
        <div className="grid__search">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Search job nr, project, client, address…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <span className="grid__count">
          {rows.length} of {jobs.length} jobs
        </span>
      </div>

      <div className="grid__scroll">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={String(col.key)}
                  className={col.align === "right" ? "align-right" : undefined}
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  {sortIndicator(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td className="grid__empty" colSpan={COLUMNS.length}>
                  No jobs to display.
                </td>
              </tr>
            ) : (
              pageRows.map((job) => (
                <tr
                  key={job.jobId}
                  className={job.jobId === selectedId ? "is-selected" : undefined}
                  onClick={() => onSelect(job.jobId)}
                  onDoubleClick={() => onOpen(job.jobId)}
                >
                  {COLUMNS.map((col) => (
                    <td key={String(col.key)} className={col.align === "right" ? "align-right" : undefined}>
                      {col.key === "projectName" ? (
                        <button
                          type="button"
                          className="linklike"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(job.jobId);
                          }}
                        >
                          {job.projectName}
                        </button>
                      ) : col.render ? (
                        col.render(job)
                      ) : (
                        String(job[col.key] ?? "")
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid__footer">
        <label className="grid__pagesize">
          Show rows
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="grid__pager">
          <span>
            {rows.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, rows.length)} of {rows.length}
          </span>
          <button type="button" className="btn btn--icon" disabled={page === 0} onClick={() => setPage(page - 1)}>
            ‹
          </button>
          <span className="grid__page">
            Page {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            className="btn btn--icon"
            disabled={page >= pageCount - 1}
            onClick={() => setPage(page + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
