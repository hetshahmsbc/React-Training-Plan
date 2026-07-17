// ---------------------------------------------------------------------------
// JobFormPage — migration of Views/Jobs/AddEditJobs.cshtml + JobsAddEdit.js.
//
// The same jobId route drives Add (id 0) and Edit (id > 0). All the field
// state, computed values and validation live in useJobForm(); this file is
// just the layout + wiring. Compare with the 619-line .cshtml and 1062-line
// ViewModel it replaces.
// ---------------------------------------------------------------------------

import { type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormField } from "../components/FormField";
import { Spinner } from "../components/Spinner";
import { useToast } from "../context/toast";
import { useJobForm } from "../hooks/useJobForm";
import type { JobApprovalStatus, Option } from "../types/job";

// Colour the workflow-status pill shown in the form header.
const WORKFLOW_PILL: Record<JobApprovalStatus, string> = {
  Draft: "pill pill--hold",
  Submitted: "pill pill--submitted",
  Approved: "pill pill--done",
};

// ---- Local select helper (FormField + native <select>) --------------------
// `value === 0` is treated as "nothing selected".

interface SelectFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  value: number;
  options: Option[];
  disabled?: boolean;
  onChange: (value: number) => void;
}

function SelectField({ label, required, error, value, options, disabled, onChange }: SelectFieldProps) {
  return (
    <FormField label={label} required={required} error={error}>
      <select value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

// Group of fields under a heading.
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="form-section">
      <legend>{title}</legend>
      <div className="form-grid">{children}</div>
    </fieldset>
  );
}

export function JobFormPage() {
  const navigate = useNavigate();
  const params = useParams<{ jobId?: string }>();
  const jobId = params.jobId ? Number(params.jobId) : 0;

  const toast = useToast();
  const { form, lookups, loading, saving, errors, isEdit, setField, toggleSector, save } = useJobForm(jobId);

  if (loading || !form || !lookups) {
    return (
      <div className="page">
        <Spinner label="Loading job…" />
      </div>
    );
  }

  const title = isEdit ? "Edit Job" : "Add New Job";
  const subtitle = isEdit ? `${form.jobNumber} - ${form.projectName || "(no name)"}` : "New job";
  const backTo = isEdit ? `/jobs/${jobId}` : "/";

  async function handleSave() {
    if (!form) return;
    const savedId = await save();
    if (savedId === null) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }
    toast.success(
      isEdit
        ? `Job ${form.jobNumber} updated successfully.`
        : `Job ${form.jobNumber} created successfully.`,
    );
    navigate("/");
  }

  /** Export this job's key fields as a one-row CSV (was "Export" to PDF). */
  function handleExport() {
    if (!form) return;
    const rows = [
      ["Job Nr", form.jobNumber],
      ["Project Name", form.projectName],
      ["Contract Value", String(form.contractValue)],
      ["Start Date", form.startDate ?? ""],
      ["Completion Date", form.completionDate ?? ""],
      ["Workflow Status", form.jobApprovalStatus],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-${form.jobNumber}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Job ${form.jobNumber} exported.`);
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">{title}</h1>
          <p className="page__subtitle">{subtitle}</p>
        </div>
        <div className="page__actions">
          {isEdit ? <span className={WORKFLOW_PILL[form.jobApprovalStatus]}>{form.jobApprovalStatus}</span> : null}
          <button type="button" className="btn btn--primary" onClick={() => navigate(backTo)}>
            Back
          </button>
        </div>
      </header>

      <Section title="Job Details">
        <SelectField
          label="Division"
          value={form.contractTypeId}
          options={lookups.contractTypes}
          onChange={(v) => setField("contractTypeId", v)}
        />
        <FormField label="Contract Value">
          <input
            type="number"
            min={0}
            value={form.contractValue}
            onChange={(e) => setField("contractValue", Number(e.target.value))}
          />
        </FormField>
        <FormField label="Workflow Status">
          <input type="text" value={form.jobApprovalStatus} readOnly disabled />
        </FormField>
        <FormField label="Job Number" required>
          <input type="text" value={form.jobNumber} readOnly disabled />
        </FormField>

        <SelectField
          label="Form of Contract"
          value={form.formOfContractId}
          options={lookups.formOfContracts}
          onChange={(v) => setField("formOfContractId", v)}
        />
        <SelectField
          label="Tender"
          value={form.tenderId}
          options={lookups.tenders}
          onChange={(v) => setField("tenderId", v)}
        />
        <SelectField
          label="Client Name"
          required
          error={errors.clientId}
          value={form.clientId}
          options={lookups.clients}
          onChange={(v) => setField("clientId", v)}
        />
        <SelectField
          label="Job Status"
          value={form.statusId}
          options={lookups.statuses}
          disabled={!isEdit}
          onChange={(v) => setField("statusId", v)}
        />

        <FormField label="Project Name" required error={errors.projectName}>
          <input
            type="text"
            maxLength={50}
            value={form.projectName}
            onChange={(e) => setField("projectName", e.target.value)}
          />
        </FormField>
        <FormField label="Client PO Number">
          <input
            type="text"
            maxLength={50}
            value={form.clientPONr}
            onChange={(e) => setField("clientPONr", e.target.value)}
          />
        </FormField>
        <FormField label="Start Date" required error={errors.startDate}>
          <input
            type="date"
            value={form.startDate ?? ""}
            onChange={(e) => setField("startDate", e.target.value || null)}
          />
        </FormField>
        <FormField label="Completion Date">
          <input
            type="date"
            min={form.startDate ?? undefined}
            value={form.completionDate ?? ""}
            onChange={(e) => setField("completionDate", e.target.value || null)}
          />
        </FormField>

        <FormField label="Calendar Weeks">
          <input type="text" value={form.calendarWeeks} readOnly disabled />
        </FormField>

        {/* Sectors — multi-select checkboxes (was a checkbox jqxComboBox) */}
        <div className="field field--wide">
          <span className="field__label">Sector</span>
          <div className="checkbox-row">
            {lookups.sectors.map((sector) => (
              <label key={sector.id} className="checkbox-chip">
                <input
                  type="checkbox"
                  checked={form.sectorIds.includes(sector.id)}
                  onChange={() => toggleSector(sector.id)}
                />
                {sector.label}
              </label>
            ))}
          </div>
        </div>

        {/* Letter of Intent — value + expiry enabled only when LOI is ticked */}
        <div className="field field--wide">
          <label className="checkbox-chip">
            <input type="checkbox" checked={form.isLOI} onChange={(e) => setField("isLOI", e.target.checked)} />
            Letter of Intent (LOI)
          </label>
        </div>
        <FormField label="LOI Value" error={errors.loiValue}>
          <input
            type="number"
            min={0}
            disabled={!form.isLOI}
            value={form.loiValue}
            onChange={(e) => setField("loiValue", Number(e.target.value))}
          />
        </FormField>
        <FormField label="LOI Expiry Date" error={errors.loiExpiryDate}>
          <input
            type="date"
            disabled={!form.isLOI}
            value={form.loiExpiryDate ?? ""}
            onChange={(e) => setField("loiExpiryDate", e.target.value || null)}
          />
        </FormField>
      </Section>

      <Section title="Address">
        <FormField label="Address Line 1">
          <input
            type="text"
            maxLength={50}
            value={form.projectAddress}
            onChange={(e) => setField("projectAddress", e.target.value)}
          />
        </FormField>
        <FormField label="Address Line 2">
          <input
            type="text"
            maxLength={50}
            value={form.projectAddress2}
            onChange={(e) => setField("projectAddress2", e.target.value)}
          />
        </FormField>
        <FormField label="City / Town">
          <input type="text" maxLength={50} value={form.city} onChange={(e) => setField("city", e.target.value)} />
        </FormField>
        <FormField label="Post Code">
          <input
            type="text"
            maxLength={50}
            value={form.postCode}
            onChange={(e) => setField("postCode", e.target.value)}
          />
        </FormField>
      </Section>

      <Section title="Insurances & Retention">
        <SelectField
          label="Retention (%)"
          value={form.retention ?? 0}
          options={lookups.retentionValues}
          onChange={(v) => setField("retention", v === 0 ? null : v)}
        />
        <SelectField
          label="Employers Liability"
          value={form.employersLiability ?? 0}
          options={lookups.insuranceValues}
          onChange={(v) => setField("employersLiability", v === 0 ? null : v)}
        />
        <SelectField
          label="Public Liability"
          value={form.publicLiability ?? 0}
          options={lookups.insuranceValues}
          onChange={(v) => setField("publicLiability", v === 0 ? null : v)}
        />
        <SelectField
          label="Professional Indemnity"
          value={form.professionalIndemnity ?? 0}
          options={lookups.insuranceValues}
          onChange={(v) => setField("professionalIndemnity", v === 0 ? null : v)}
        />
        <SelectField
          label="Contracts All Risk"
          value={form.contractsAllRisk ?? 0}
          options={lookups.insuranceValues}
          onChange={(v) => setField("contractsAllRisk", v === 0 ? null : v)}
        />
        <FormField label="LADs Per Week">
          <input
            type="number"
            min={0}
            value={form.ladPerWeek}
            onChange={(e) => setField("ladPerWeek", Number(e.target.value))}
          />
        </FormField>
        <SelectField
          label="Defects Liability Period"
          value={form.defectsLiabilityPeriodId}
          options={lookups.defectsLiabilityPeriods}
          onChange={(v) => setField("defectsLiabilityPeriodId", v)}
        />
        <SelectField
          label="Project Insurance"
          value={form.projectInsuranceId}
          options={lookups.projectInsurances}
          onChange={(v) => setField("projectInsuranceId", v)}
        />
      </Section>

      <Section title="Sections Complete">
        <SectionComplete
          index={1}
          complete={form.isSectionOneComplete}
          date={form.sectionOneCompletionDate}
          name={form.sectionOneName}
          onToggle={(v) => setField("isSectionOneComplete", v)}
          onDate={(v) => setField("sectionOneCompletionDate", v)}
          onName={(v) => setField("sectionOneName", v)}
        />
        <SectionComplete
          index={2}
          complete={form.isSectionTwoComplete}
          date={form.sectionTwoCompletionDate}
          name={form.sectionTwoName}
          onToggle={(v) => setField("isSectionTwoComplete", v)}
          onDate={(v) => setField("sectionTwoCompletionDate", v)}
          onName={(v) => setField("sectionTwoName", v)}
        />
        <SectionComplete
          index={3}
          complete={form.isSectionThreeComplete}
          date={form.sectionThreeCompletionDate}
          name={form.sectionThreeName}
          onToggle={(v) => setField("isSectionThreeComplete", v)}
          onDate={(v) => setField("sectionThreeCompletionDate", v)}
          onName={(v) => setField("sectionThreeName", v)}
        />
      </Section>

      <Section title="Key Dates">
        <FormField label="Practical Completion Date">
          <input
            type="date"
            value={form.practicalCompletionDate ?? ""}
            onChange={(e) => setField("practicalCompletionDate", e.target.value || null)}
          />
        </FormField>
        <FormField label="End of DLP Date">
          <input type="date" value={form.endOfDLPDate ?? ""} readOnly disabled />
        </FormField>
        <FormField label="Retention Due Date">
          <input type="date" value={form.retentionDueDate ?? ""} readOnly disabled />
        </FormField>
        <FormField label="Forecast Completion Date">
          <input
            type="date"
            value={form.forecastCompletionDate ?? ""}
            onChange={(e) => setField("forecastCompletionDate", e.target.value || null)}
          />
        </FormField>
        <FormField label="EOT Granted To Date">
          <input
            type="date"
            value={form.eotGrantToDate ?? ""}
            onChange={(e) => setField("eotGrantToDate", e.target.value || null)}
          />
        </FormField>
        <FormField label="Final Account Value">
          <input
            type="number"
            min={0}
            value={form.finalAccountValue}
            onChange={(e) => setField("finalAccountValue", Number(e.target.value))}
          />
        </FormField>
      </Section>

      <Section title="Description">
        <div className="field field--full">
          <span className="field__label field__label--static">Description of Work</span>
          <textarea
            rows={4}
            maxLength={5000}
            value={form.descriptionOfWork}
            onChange={(e) => setField("descriptionOfWork", e.target.value)}
          />
        </div>
      </Section>

      {/* Bottom action bar (Export / History on the left, Save on the right) */}
      <div className="form-actions">
        <div className="form-actions__left">
          <button type="button" className="btn btn--primary" onClick={handleExport}>
            Export
          </button>
          <button
            type="button"
            className="btn btn--primary"
            title="Read-only in this demo"
            onClick={() => toast.info("History is read-only in this demo.")}
          >
            History
          </button>
        </div>
        <button type="button" className="btn btn--primary btn--lg" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// One "Section N complete" trio: a checkbox that enables its date + name.
interface SectionCompleteProps {
  index: number;
  complete: boolean;
  date: string | null;
  name: string;
  onToggle: (value: boolean) => void;
  onDate: (value: string | null) => void;
  onName: (value: string) => void;
}

function SectionComplete({ index, complete, date, name, onToggle, onDate, onName }: SectionCompleteProps) {
  return (
    <>
      <div className="field">
        <span className="field__label">Section {index} complete</span>
        <label className="checkbox-chip">
          <input type="checkbox" checked={complete} onChange={(e) => onToggle(e.target.checked)} />
          Complete
        </label>
      </div>
      <FormField label={`Section ${index} Date`}>
        <input
          type="date"
          disabled={!complete}
          value={date ?? ""}
          onChange={(e) => onDate(e.target.value || null)}
        />
      </FormField>
      <FormField label={`Section ${index} Name`}>
        <input
          type="text"
          maxLength={50}
          disabled={!complete}
          value={name}
          onChange={(e) => onName(e.target.value)}
        />
      </FormField>
    </>
  );
}
