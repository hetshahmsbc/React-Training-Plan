import type { Task } from "../types/task";
import { Button } from "./Button";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// Turn the stored status values into nice display text.
const STATUS_LABEL: Record<Task["status"], string> = {
  pending: "Pending",
  "in-progress": "In progress",
  done: "Done",
};

// Format an ISO date string like "7 Jul 2026".
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty">
        <div className="empty__icon">🗒️</div>
        <p className="empty__title">No tasks found</p>
        <p className="empty__text">
          Try adjusting your search, or click “+ Add Task” to create one.
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-card task-card--${task.priority}`}>
          <div className="task-card__main">
            <div className="task-card__top">
              <h3 className="task-card__title">{task.title}</h3>
              <span className={`badge badge--${task.priority}`}>
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className="task-card__desc">{task.description}</p>
            )}

            <div className="task-card__meta">
              <span className={`status status--${task.status}`}>
                {STATUS_LABEL[task.status]}
              </span>
              <span className="task-card__date">📅 {formatDate(task.createdAt)}</span>
            </div>
          </div>

          <div className="task-card__actions">
            <Button variant="secondary" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(task.id)}>
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
