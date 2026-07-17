// Status dropdown above the list. Was the `statusSource` jqxDropDownList in
// Index.cshtml whose `change` event called bindJobListGrid(true).
// The options live in the data module (STATUS_FILTERS) so this file stays
// component-only (keeps React Fast Refresh happy).

import { STATUS_FILTERS } from "../mock/jobsData";

interface StatusFilterProps {
  value: number;
  onChange: (value: number) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <label className="status-filter">
      <span>Status</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {STATUS_FILTERS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
