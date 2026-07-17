// ---------------------------------------------------------------------------
// Small formatting + date helpers.
//
// In the KnockoutJS app these were scattered global functions (diff_weeks,
// currency cell formatters in jqxGrid, `.toDateString()` juggling). Collecting
// them here keeps the components clean and makes each piece unit-testable.
// ---------------------------------------------------------------------------

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** £8,450,000.00 — matches the grid's `cellsformat: 'c2'`. Blank for null. */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return currencyFormatter.format(value);
}

/** 5 -> "5.00%". Blank for null (was the grid's `cellsformat: 'p2'`). */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return `${value.toFixed(2)}%`;
}

/** ISO "2025-06-27" -> "27/06/2025" (the app-wide dd/MM/yyyy format). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

/**
 * Whole weeks between two ISO dates — the React version of the old global
 * `diff_weeks(dt1, dt2)` used to fill the "Calendar Weeks" box.
 */
export function diffWeeks(startIso: string | null, endIso: string | null): number {
  if (!startIso || !endIso) return 0;
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.round(Math.abs(end - start) / msPerWeek);
}

/** Add whole months to an ISO date, returning a new ISO date. */
export function addMonths(iso: string | null, months: number): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + months);
  return toIsoDate(d);
}

/** Add whole years to an ISO date, returning a new ISO date. */
export function addYears(iso: string | null, years: number): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setFullYear(d.getFullYear() + years);
  return toIsoDate(d);
}

/** Add whole days to an ISO date, returning a new ISO date. */
export function addDays(iso: string | null, days: number): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  return toIsoDate(d);
}

/** Date -> "yyyy-MM-dd" (the value format <input type="date"> expects). */
export function toIsoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
