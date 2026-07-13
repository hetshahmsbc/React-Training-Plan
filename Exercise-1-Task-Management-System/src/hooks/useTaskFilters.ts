import { useMemo, useState } from "react";
import type { Task, TaskStatus } from "../types/task";

// "all" = show every status; otherwise show only one status.
export type StatusFilter = "all" | TaskStatus;

// The ways we can sort the list.
export type SortBy = "newest" | "oldest" | "title" | "priority";

// How many tasks to show per page.
const PAGE_SIZE = 5;

// Order used for the "priority" sort: high first, low last.
const PRIORITY_RANK: Record<Task["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

// A custom hook: reusable logic that uses other hooks (useState/useMemo).
export function useTaskFilters(tasks: Task[]) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [page, setPage] = useState(1);

  // SEARCH + FILTER + SORT.
  // useMemo re-computes only when one of its dependencies changes (not every render).
  const filterTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "priority") return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      return b.createdAt.localeCompare(a.createdAt); // "newest" (default)
    });
    return result;
  }, [tasks, search, statusFilter, sortBy]);

  // PAGINATION maths.
  const totalPages = Math.max(1, Math.ceil(filterTasks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages); // never sit past the last page
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageTasks = filterTasks.slice(start, start + PAGE_SIZE);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    page: currentPage,
    setPage,
    totalPages,
    pageTasks,
    totalResults: filterTasks.length,
  };
}
