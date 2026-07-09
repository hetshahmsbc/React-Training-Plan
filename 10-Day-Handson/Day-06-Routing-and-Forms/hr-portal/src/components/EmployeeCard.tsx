// EmployeeCard — one employee tile used in the list grid.

import { Link } from "react-router-dom";
import type { Employee } from "../types";
import { useToast } from "./Toast";

interface EmployeeCardProps {
  employee: Employee;
  onDelete: (id: string) => void;
}

// e.g. "Asha Rao" -> "AR"
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// deterministic soft colour for each department, based on its name
function departmentColors(department: string): { background: string; color: string } {
  let hash = 0;
  for (let i = 0; i < department.length; i++) {
    hash = department.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return { background: `hsl(${hue} 75% 94%)`, color: `hsl(${hue} 45% 32%)` };
}

export default function EmployeeCard({ employee, onDelete }: EmployeeCardProps) {
  const { showToast } = useToast();

  function handleDelete() {
    if (window.confirm(`Remove ${employee.name} from the team?`)) {
      onDelete(employee.id);
      showToast(`${employee.name} was removed`, "info");
    }
  }

  return (
    <article className="emp-card">
      <div className="emp-card__top">
        {employee.image ? (
          <img className="avatar" src={employee.image} alt={employee.name} />
        ) : (
          <div className="avatar avatar--fallback">{getInitials(employee.name)}</div>
        )}
        <div>
          <h3 className="emp-card__name">{employee.name}</h3>
          <p className="emp-card__role">{employee.role}</p>
        </div>
      </div>

      <span className="badge" style={departmentColors(employee.department)}>
        {employee.department}
      </span>

      <p className="emp-card__email">{employee.email}</p>

      <div className="emp-card__actions">
        <Link to={`/employees/${employee.id}`} className="btn btn--ghost btn--sm">
          View
        </Link>
        <button className="btn btn--danger btn--sm" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
