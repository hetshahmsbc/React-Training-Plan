// Employee detail page — "/employees/:id" (useParams).

import { useParams, useNavigate, Link } from "react-router-dom";
import type { Employee } from "../types";
import Spinner from "../components/Spinner";
import { useToast } from "../components/Toast";

interface EmployeeDetailProps {
  employees: Employee[];
  loading: boolean;
  onDelete: (id: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function EmployeeDetail({ employees, loading, onDelete }: EmployeeDetailProps) {
  const { id } = useParams(); // e.g. /employees/3 -> id = "3"
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (loading) return <Spinner label="Loading employee…" />;

  const employee = employees.find((e) => e.id === id);

  if (!employee) {
    return (
      <section className="empty">
        <h1>Employee not found</h1>
        <p>No employee has the id "{id}".</p>
        <Link to="/employees" className="btn btn--ghost">
          ← Back to employees
        </Link>
      </section>
    );
  }

  // `employee` is guaranteed to exist past this point
  const emp = employee;

  function handleDelete() {
    if (window.confirm(`Remove ${emp.name} from the team?`)) {
      onDelete(emp.id);
      showToast(`${emp.name} was removed`, "info");
      navigate("/employees");
    }
  }

  return (
    <section>
      <Link to="/employees" className="back-link">
        ← Back to employees
      </Link>

      <div className="detail-header">
        {emp.image ? (
          <img className="avatar avatar--lg" src={emp.image} alt={emp.name} />
        ) : (
          <div className="avatar avatar--lg avatar--fallback">{getInitials(emp.name)}</div>
        )}
        <div className="detail-header__info">
          <h1>{emp.name}</h1>
          <p className="detail-header__role">{emp.role}</p>
          <span className="badge">{emp.department}</span>
        </div>
        <button className="btn btn--danger" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <dl className="info-grid">
        <div>
          <dt>Email</dt>
          <dd>{emp.email}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{emp.phone}</dd>
        </div>
        <div>
          <dt>Age</dt>
          <dd>{emp.age}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{emp.department}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{emp.role}</dd>
        </div>
      </dl>
    </section>
  );
}
