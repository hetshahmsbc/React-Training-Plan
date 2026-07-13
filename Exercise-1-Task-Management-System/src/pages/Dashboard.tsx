import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";
import type { NewTaskInput } from "../context/TaskContext";
import type { Task } from "../types/task";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { Toolbar } from "../components/Toolbar";
import { Pagination } from "../components/Pagination";

export function Dashboard() {
  const { user, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask } = useTask();

  // All search/filter/sort/pagination state comes from our custom hook.
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    pageTasks,
    totalResults,
  } = useTaskFilters(tasks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function openAddModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  function handleSubmit(input: NewTaskInput) {
    if (editingTask) {
      updateTask(editingTask.id, input);
    } else {
      addTask(input);
    }
    closeModal();
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand">
            <span className="brand__logo">✓</span>
            <span>Task Manager</span>
          </div>
          <div className="topbar__right">
            <span className="topbar__user">👤 {user?.username}</span>
            <Button variant="secondary" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="dashboard__head">
          <div>
            <h1 className="dashboard__title">My Tasks</h1>
            <p className="dashboard__subtitle">
              {totalResults} task{totalResults === 1 ? "" : "s"} found
            </p>
          </div>
          <Button onClick={openAddModal}>+ Add Task</Button>
        </div>

        <Toolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        <TaskList tasks={pageTasks} onEdit={openEditModal} onDelete={deleteTask} />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>

      <Modal
        title={editingTask ? "Edit task" : "Add task"}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <TaskForm
          initialTask={editingTask ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
