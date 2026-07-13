import { useState } from "react";
import type { FormEvent } from "react";
import type { Task, TaskStatus, TaskPriority } from "../types/task";
import type { NewTaskInput } from "../context/TaskContext";
import { Input } from "./Input";
import { Button } from "./Button";

interface TaskFormProps {
  initialTask?: Task; // if given we're editing; if not, we're adding
  onSubmit: (input: NewTaskInput) => void;
  onCancel: () => void;
}

export function TaskForm({ initialTask, onSubmit, onCancel }: TaskFormProps) {
  // Pre-fill from the task being edited, or use sensible defaults.
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? "pending");

  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? "medium");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim() === "") {
      setError("Title is required.");
      return;
    }
    onSubmit({ title, description, status, priority });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
      />

      <div className="field">
        <label className="field__label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="field__input"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Extra details (optional)"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="field__input"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          className="field__input"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {error && <p className="auth__error">{error}</p>}

      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialTask ? "Save changes" : "Add task"}</Button>
      </div>
    </form>
  );
}
