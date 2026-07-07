import type { Department } from "../types";

interface FilterProps {
  search: string;
  departmentFilter: string;
  departments: Department[];
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
}

function Filters({
  search,
  departmentFilter,
  departments,
  onSearchChange,
  onDepartmentChange,
}: FilterProps) {
  return (
    <div className="toolbar">
      <div className="search">
        <span className="search-icon">🔍</span>
        <input
          placeholder="Search employees by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select value={departmentFilter} onChange={(e) => onDepartmentChange(e.target.value)}>
        <option value="All">All departments</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filters;
