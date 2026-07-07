import type { Employee } from "../types";
import { departmentColor, getInitials } from "../utils";

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

function EmployeeList({ employees, onEdit, onDelete }: EmployeeListProps) {
  // CONDITIONAL RENDERING : If nothing to show, show a message instead of a list
  if (employees.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">🔍</div>
        <p>No employees match your search.</p>
      </div>
    );
  }

  return (
    <div className="emp-grid">
      {employees.map((employee) => {
        const color = departmentColor[employee.department];
        return (
          // KEY: unique + stable so React can track each card efficiently.
          <article key={employee.id} className="emp-card">
            <div className="emp-top">
              <div className="avatar" style={{ background: color }}>
                {getInitials(employee.name)}
              </div>
              <div className="emp-info">
                <h3>{employee.name}</h3>
                <p className="muted">{employee.role || "No role"}</p>
              </div>
            </div>

            <div className="emp-meta">
              {/* color + "22" = same color at ~13% opacity for a soft pill */}
              <span className="badge" style={{ background: color + "22", color }}>
                {employee.department}
              </span>
              <span className="salary">${employee.salary.toLocaleString()}</span>
            </div>

            <div className="emp-actions">
              <button className="btn-ghost" onClick={() => onEdit(employee)}>
                Edit
              </button>
              <button className="btn-ghost danger" onClick={() => onDelete(employee.id)}>
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default EmployeeList;
