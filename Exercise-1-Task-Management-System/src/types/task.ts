/**
 * Task domain types.
 *
 * Central definitions for what a "task" looks like across the app.
 * Keeping these in one place means every component, context, and
 * function shares the exact same shape — the single source of truth.
 */

/** The lifecycle state a task can be in. */
export type TaskStatus = "pending" | "in-progress" | "done";

/** How important/urgent a task is. */
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
}
