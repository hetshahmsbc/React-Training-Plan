import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Task } from "../types/task";

// The data needed to CREATE a task.We leave out `id` and `createdAt`
// because the context generates those itself. `Omit<...>` = "Task minus these".
export type NewTaskInput = Omit<Task, "id" | "createdAt">;

interface TaskContextValue {
  tasks: Task[];
  addTask: (input: NewTaskInput) => void;
  updateTask: (id: string, input: NewTaskInput) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const STORAGE_KEY = "tms.tasks";

// Starter tasks so the dashboard isn't empty the very first time.
const SEED_TASKS: Task[] = [
  {
    id: "1",
    title: "Set up the project",
    description: "Scaffold React + TypeScript with Vite.",
    status: "done",
    priority: "high",
    createdAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "2",
    title: "Build the login screen",
    description: "Dummy auth with a reusable form.",
    status: "in-progress",
    priority: "medium",
    createdAt: "2026-07-02T09:00:00.000Z",
  },
  {
    id: "3",
    title: "Add task CRUD",
    description: "Create, read, update and delete tasks.",
    status: "pending",
    priority: "high",
    createdAt: "2026-07-03T09:00:00.000Z",
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Task[]) : SEED_TASKS;
  });

  // Whenever `tasks` changes, save it to the browser so it survives refresh.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(input: NewTaskInput) {
    const newTask: Task = {
      ...input,
      id: crypto.randomUUID(), // browser built in : unique id
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]); // newest first
  }
  function updateTask(id: string, input: NewTaskInput) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...input } : task)));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }
  const value: TaskContextValue = { tasks, addTask, updateTask, deleteTask };
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTask(): TaskContextValue {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("userTasks must be used inside a TaskProvider");
  }
  return context;
}
