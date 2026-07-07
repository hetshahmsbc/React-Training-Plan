import type React from "react";
import { DEPARTMENTS } from "../data";

// The form deals only in strings (an <input> value is ALWAYS a string),
// (even for numbers). We'll convert salary to a real number later, in App.

export interface EmployeeFormValues {
  name: string;
  role: string;
  department: string;
  salary: string;
}

// "Props" = the data & functions a parent hands down to this component.
interface EmployeeFormProps {
  values: EmployeeFormValues;
  isEditing: boolean;
  onChange: (field: keyof EmployeeFormValues, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function EmployeeForm({ values, isEditing, onChange, onSubmit, onCancel }: EmployeeFormProps) {
  // Stop the browser reloading the page, then tell App to handle submit.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      {/* CONDITIONAL RENDERING: heading changes based on isEditing */}
      <h2>{isEditing ? "✏️ Edit Employee" : "➕ Add Employee"}</h2>

      <label className="field">
        <span>Name</span>
        <input
          placeholder="e.g. Jane Cooper"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </label>

      <label className="field">
        <span>Role</span>
        <input
          placeholder="e.g. Product Designer"
          value={values.role}
          onChange={(e) => onChange("role", e.target.value)}
        />
      </label>

      <label className="field">
        <span>Department</span>
        <select value={values.department} onChange={(e) => onChange("department", e.target.value)}>
          {/* LIST + KEY: build <option>s from the DEPARTMENTS array */}
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Salary</span>
        <input
          type="number"
          placeholder="e.g. 75000"
          value={values.salary}
          onChange={(e) => onChange("salary", e.target.value)}
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {isEditing ? "Save Changes" : "Add Employee"}
        </button>
        {/* Show Cancel button only while editing */}
        {isEditing && (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default EmployeeForm;
