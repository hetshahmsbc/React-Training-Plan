// ---------------------------------------------------------------------------
// JobsListPage — migration of Views/Jobs/Index.cshtml + Jobs.js.
//
// Header matches the real app: title, Status filter, History, + Add New and a
// "⋮" menu (Open / Delete / Refresh / Export). Every action gives feedback via
// toast notifications (the React version of the old Notification.* helpers).
// ---------------------------------------------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { JobsTable } from "../components/JobsTable";
import { KebabMenu } from "../components/KebabMenu";
import { Spinner } from "../components/Spinner";
import { StatusFilter } from "../components/StatusFilter";
import { Icon } from "../components/icons";
import { useToast } from "../context/toast";
import { useJobsList } from "../hooks/useJobsList";
import { deleteJob } from "../api/jobsApi";
import type { JobListItem } from "../types/job";

/** Download the current jobs as CSV (was the grid's "Export to Excel"). */
function exportToCsv(jobs: JobListItem[]) {
  const headers = ["Job Nr", "Project Name", "Division", "Status", "Client", "Contract Value"];
  const lines = jobs.map((j) =>
    [j.jobNumber, j.projectName, j.contractType, j.status, j.clientName, j.contractValue ?? ""]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "jobs.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function JobsListPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [statusId, setStatusId] = useState(1); // 1 = ALL
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JobListItem | null>(null);

  const { jobs, loading, error, refresh } = useJobsList(statusId);

  const selectedJob = jobs.find((j) => j.jobId === selectedId) ?? null;

  function handleStatusChange(value: number) {
    setStatusId(value);
    setSelectedId(null);
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    const { jobNumber, projectName } = pendingDelete;
    const res = await deleteJob(pendingDelete.jobId);
    setPendingDelete(null);
    setSelectedId(null);
    if (res.error === 0) {
      toast.success(`Job ${jobNumber} — ${projectName} deleted.`);
      refresh();
    } else {
      toast.error(res.message || "Could not delete the job.");
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Jobs</h1>

        <div className="page__actions">
          <StatusFilter value={statusId} onChange={handleStatusChange} />
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => toast.info("History is read-only in this demo.")}
          >
            History
          </button>
          <button type="button" className="btn btn--primary" onClick={() => navigate("/jobs/add")}>
            <Icon name="plus" size={16} /> Add New
          </button>
          <KebabMenu
            actions={[
              {
                label: "Open job",
                disabled: selectedId === null,
                onClick: () => selectedId && navigate(`/jobs/${selectedId}`),
              },
              {
                label: "Delete job",
                danger: true,
                disabled: selectedId === null,
                onClick: () => setPendingDelete(selectedJob),
              },
              { label: "Refresh", onClick: () => { refresh(); toast.info("List refreshed."); } },
              { label: "Export to Excel", onClick: () => { exportToCsv(jobs); toast.success("Jobs exported."); } },
            ]}
          />
        </div>
      </header>

      {error ? <div className="banner banner--error">{error}</div> : null}

      {loading ? (
        <Spinner label="Loading jobs…" />
      ) : (
        <JobsTable
          jobs={jobs}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onOpen={(id) => navigate(`/jobs/${id}`)}
        />
      )}

      <p className="page__hint">
        Tip: click the <strong>project name</strong> (or double-click a row) to open a job.
      </p>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete job"
        message={
          pendingDelete
            ? `Are you sure you want to delete job ${pendingDelete.jobNumber} — ${pendingDelete.projectName}? This cannot be undone.`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
