// ---------------------------------------------------------------------------
// JobDirectoryPage — Job Team + Job Directory (Views/Jobs/JobDirectory.cshtml).
//
// Fully editable: assign employees to team roles, add / edit / delete rows in
// the directory grid (with dropdowns), and Save (persisted via localStorage).
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { Icon } from "../components/icons";
import { useToast } from "../context/toast";
import { useJobDirectory } from "../hooks/useJobDirectory";
import { getJob } from "../api/jobsApi";

const DIRECTORY_COLUMNS = [
  "Organisation Type",
  "Organisation",
  "Contact",
  "Address",
  "Phone",
  "Mobile",
  "Email",
  "Notes",
];

export function JobDirectoryPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const params = useParams<{ jobId?: string }>();
  const jobId = params.jobId ? Number(params.jobId) : 0;

  const [title, setTitle] = useState<string | null>(null);
  const { team, entries, lookups, loading, saving, setRole, addEntry, updateEntry, removeEntry, save } =
    useJobDirectory(jobId);

  useEffect(() => {
    let active = true;
    getJob(jobId).then((res) => {
      if (!active) return;
      const { jobNumber, projectName } = res.data.form;
      setTitle(`${jobNumber} - ${projectName}`);
    });
    return () => {
      active = false;
    };
  }, [jobId]);

  async function handleSave() {
    const okSaved = await save();
    if (okSaved) {
      toast.success("Job directory saved.");
    } else {
      toast.error("Could not save the job directory.");
    }
  }

  if (title === null || loading || !lookups) {
    return (
      <div className="page">
        <Spinner label="Loading job directory…" />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">{title}</h1>
        <div className="page__actions">
          <button type="button" className="btn btn--primary" onClick={() => navigate(`/jobs/${jobId}`)}>
            Back
          </button>
        </div>
      </header>

      {/* Job Team */}
      <section className="panel">
        <div className="panel__head">
          <h2>Job Team</h2>
          <div className="page__actions">
            <button type="button" className="btn" disabled title="Email is read-only in this demo">
              Email History
            </button>
            <button type="button" className="btn" disabled title="Email is read-only in this demo">
              Email
            </button>
            <button type="button" className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
        <div className="form-grid">
          {lookups.roles.map((role) => (
            <div className="field" key={role.key}>
              <div className="field__control">
                <select value={team[role.key] ?? 0} onChange={(e) => setRole(role.key, Number(e.target.value))}>
                  {lookups.employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.label}
                    </option>
                  ))}
                </select>
                <label className="field__label">
                  {role.label}
                  {role.required ? <span className="field__required">*</span> : null}
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Job Directory grid */}
      <section className="panel">
        <div className="panel__head">
          <h2>Job Directory</h2>
          <div className="page__actions">
            <button type="button" className="btn btn--primary" onClick={addEntry}>
              <Icon name="plus" size={16} /> Add New
            </button>
            <button type="button" className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <div className="grid grid--editable">
          <div className="grid__scroll">
            <table>
              <thead>
                <tr>
                  {DIRECTORY_COLUMNS.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td className="grid__empty" colSpan={DIRECTORY_COLUMNS.length + 1}>
                      No entries yet. Click <strong>+ Add New</strong> to add a directory contact.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <select
                          value={entry.organisationTypeId}
                          onChange={(e) => updateEntry(entry.id, { organisationTypeId: Number(e.target.value) })}
                        >
                          {lookups.organisationTypes.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={entry.organisationId}
                          onChange={(e) => updateEntry(entry.id, { organisationId: Number(e.target.value) })}
                        >
                          {lookups.organisations.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.contact}
                          onChange={(e) => updateEntry(entry.id, { contact: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.address}
                          onChange={(e) => updateEntry(entry.id, { address: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.phone}
                          onChange={(e) => updateEntry(entry.id, { phone: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.mobile}
                          onChange={(e) => updateEntry(entry.id, { mobile: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          value={entry.email}
                          onChange={(e) => updateEntry(entry.id, { email: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.notes}
                          onChange={(e) => updateEntry(entry.id, { notes: e.target.value })}
                        />
                      </td>
                      <td className="align-right">
                        <button
                          type="button"
                          className="btn btn--icon btn--danger"
                          title="Remove row"
                          onClick={() => removeEntry(entry.id)}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="grid__footer">
            <span className="grid__pagesize">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
