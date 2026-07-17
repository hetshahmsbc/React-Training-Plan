// Generic helpers over an in-memory array: list (with search / sort / filter /
// pagination) and CRUD. ConfigurableDashboard sends query params for search,
// sorting, filtering and paging — this file understands all the common names so
// the dashboards work without extra wiring.

import type { Request } from 'express';
import type { WithId } from './types';

// Keys that are NOT treated as column filters.
const RESERVED = new Set([
  'search', 'q', 'page', 'pageSize', 'limit', 'perPage', 'per_page',
  'sortField', 'sortBy', 'sort', 'sortDir', 'sortOrder', 'order', 'ordering',
]);

export interface ListResult<T> {
  // These four field names match what ConfigurableDashboard reads by default.
  data: T[];
  currentPage: number;
  totalRecords: number;
  totalPage: number;
}

function firstValue(v: unknown): string {
  return Array.isArray(v) ? String(v[0]) : String(v ?? '');
}

export function queryCollection<T extends WithId>(
  items: T[],
  req: Request,
  searchableFields: (keyof T)[],
): ListResult<T> {
  const q = req.query;
  let rows = [...items];

  // --- Search (case-insensitive substring across the given fields) ----------
  const search = firstValue(q.search ?? q.q).trim().toLowerCase();
  if (search) {
    rows = rows.filter((row) =>
      searchableFields.some((field) =>
        String(row[field] ?? '').toLowerCase().includes(search),
      ),
    );
  }

  // --- Column filters (any query key that maps to a real field) -------------
  for (const key of Object.keys(q)) {
    if (RESERVED.has(key)) continue;
    if (!(key in (items[0] ?? {}))) continue;
    const raw = firstValue(q[key]).trim();
    if (raw === '') continue;
    // Comma-separated list => "in" match, otherwise exact (loose) match.
    const wanted = raw.split(',').map((s) => s.trim().toLowerCase());
    rows = rows.filter((row) =>
      wanted.includes(String((row as Record<string, unknown>)[key] ?? '').toLowerCase()),
    );
  }

  // --- Sorting ---------------------------------------------------------------
  let sortField = firstValue(q.sortField ?? q.sortBy ?? q.sort);
  let sortDir = firstValue(q.sortDir ?? q.sortOrder ?? q.order).toLowerCase();
  // Support Django-style "ordering=-field".
  const ordering = firstValue(q.ordering);
  if (ordering) {
    sortField = ordering.replace(/^-/, '');
    sortDir = ordering.startsWith('-') ? 'desc' : 'asc';
  }
  if (sortField && sortField in (items[0] ?? {})) {
    const dir = sortDir === 'desc' ? -1 : 1;
    rows.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortField];
      const bv = (b as Record<string, unknown>)[sortField];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }

  // --- Pagination ------------------------------------------------------------
  const totalRecords = rows.length;
  const page = Math.max(1, parseInt(firstValue(q.page) || '1', 10));
  const pageSize = Math.max(
    1,
    parseInt(firstValue(q.pageSize ?? q.limit ?? q.perPage ?? q.per_page) || '10', 10),
  );
  const totalPage = Math.max(1, Math.ceil(totalRecords / pageSize));
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);

  return { data, currentPage: page, totalRecords, totalPage };
}

let counters: Record<string, number> = {};

/** Next id for a collection (keeps ids unique even after deletes). */
export function nextId<T extends WithId>(name: string, items: T[]): number {
  const maxExisting = items.reduce((max, r) => Math.max(max, r.id), 0);
  const seen = counters[name] ?? 0;
  const next = Math.max(maxExisting, seen) + 1;
  counters[name] = next;
  return next;
}
