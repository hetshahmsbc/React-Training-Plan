// Employee list page — "/employees".

import { useState } from "react";
import { Link } from "react-router-dom";
import type { Employee } from "../types";
import EmployeeCard from "../components/EmployeeCard";
import Spinner from "../components/Spinner";

interface EmployeeListProps {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
}

export default function EmployeeList({ employees, loading, error, onDelete }: EmployeeListProps) {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All");

  // unique department names for the filter dropdown
  const departments = ["All", ...Array.from(new Set(employees.map((e) => e.department))).sort()];

  const filtered = employees.filter((employee) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      employee.name.toLowerCase().includes(q) ||
      employee.email.toLowerCase().includes(q);
    const matchesDept = dept === "All" || employee.department === dept;
    return matchesQuery && matchesDept;
  });

  return (
    <section>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Browse, search and manage your team.</p>
        </div>
        <Link to="/employees/new" className="btn">
          + Add Employee
        </Link>
      </div>

      {loading && <Spinner label="Loading employees…" />}
      {error && <div className="alert alert--error">⚠ {error}</div>}

      {!loading && !error && (
        <>
          <div className="toolbar">
            <input
              className="search"
              type="search"
              placeholder="Search by name or email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="filter" value={dept} onChange={(e) => setDept(e.target.value)}>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All departments" : d}
                </option>
              ))}
            </select>
            <span className="count">
              Showing {filtered.length} of {employees.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <p>No employees match your search.</p>
            </div>
          ) : (
            <div className="emp-grid">
              {filtered.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} onDelete={onDelete} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
