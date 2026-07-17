// ---------------------------------------------------------------------------
// JobDashboardPage — the job "landing" screen (Views/Jobs/_JobDashboard).
//
// READ-ONLY in this migration. The tabs are static; only the two tiles that
// lead to the migrated screens (General Details → edit form, Job Directory)
// actually navigate. "Add Tile" is a placeholder.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { Icon } from "../components/icons";
import { getJob } from "../api/jobsApi";

const TABS = [
  "Project Information",
  "Drawings & Specifications",
  "Project Admin",
  "Site Admin",
  "Health & Safety",
  "Sub-Contractors",
  "Financial",
  "O&M Manual",
  "QA",
  "Contract Documents",
];

export function JobDashboardPage() {
  const navigate = useNavigate();
  const params = useParams<{ jobId?: string }>();
  const jobId = params.jobId ? Number(params.jobId) : 0;

  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getJob(jobId).then((res) => {
      if (!active) return;
      const { jobNumber, projectName } = res.data.form;
      setTitle(`Job: ${jobNumber} - ${projectName}`);
    });
    return () => {
      active = false;
    };
  }, [jobId]);

  if (title === null) {
    return (
      <div className="page">
        <Spinner label="Loading job…" />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">{title}</h1>
        <div className="page__actions">
          <button type="button" className="btn btn--primary" onClick={() => navigate("/")}>
            Back
          </button>
        </div>
      </header>

      {/* Read-only tabs (visual parity with the real app) */}
      <div className="tabs" role="tablist">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={index === 0}
            className={`tabs__tab${index === 0 ? " is-active" : ""}`}
            disabled={index !== 0}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tiles">
        <button type="button" className="tile" onClick={() => navigate(`/jobs/${jobId}/general-details`)}>
          <span className="tile__icon">
            <Icon name="info" size={26} />
          </span>
          <span className="tile__label">General Details</span>
        </button>

        <button type="button" className="tile" onClick={() => navigate(`/jobs/${jobId}/directory`)}>
          <span className="tile__icon">
            <Icon name="folder" size={26} />
          </span>
          <span className="tile__label">Job Directory</span>
        </button>

        <button type="button" className="tile tile--muted" disabled title="Read-only in this demo">
          <span className="tile__icon">
            <Icon name="plus" size={26} />
          </span>
          <span className="tile__label">Add Tile</span>
        </button>
      </div>
    </div>
  );
}
