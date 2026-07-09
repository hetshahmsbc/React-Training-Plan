// Dashboard page — "/" index route.

import type { Employee } from "../types";
import Spinner from "../components/Spinner";

interface DashboardProps {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

export default function Dashboard({ employees, loading, error }: DashboardProps) {
  if (loading) return <Spinner label="Loading dashboard…" />;
  if (error) return <div className="alert alert--error">⚠ {error}</div>;

  const total = employees.length;

  // { Engineering: 4, Sales: 2, ... }
  const byDepartment = employees.reduce<Record<string, number>>((counts, e) => {
    counts[e.department] = (counts[e.department] ?? 0) + 1;
    return counts;
  }, {});

  const departmentCount = Object.keys(byDepartment).length;
  const averageAge =
    total === 0 ? 0 : Math.round(employees.reduce((sum, e) => sum + e.age, 0) / total);

  // sort departments biggest first for the chart
  const maxCount = Math.max(1, ...Object.values(byDepartment));
  const breakdown = Object.entries(byDepartment).sort((a, b) => b[1] - a[1]);

  return (
    <section>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">A quick overview of your organisation.</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: "var(--primary-soft)" }}>
            👥
          </div>
          <div>
            <span className="stat-card__value">{total}</span>
            <span className="stat-card__label">Total employees</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: "var(--success-soft)" }}>
            🏢
          </div>
          <div>
            <span className="stat-card__value">{departmentCount}</span>
            <span className="stat-card__label">Departments</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: "#fef3c7" }}>
            📊
          </div>
          <div>
            <span className="stat-card__value">{averageAge}</span>
            <span className="stat-card__label">Average age</span>
          </div>
        </div>
      </div>

      <div className="dept-breakdown">
        <h2>Headcount by department</h2>
        {breakdown.length === 0 ? (
          <p className="count">No data yet.</p>
        ) : (
          breakdown.map(([deptName, count]) => (
            <div className="bar-row" key={deptName}>
              <span className="bar-row__label">{deptName}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
              </span>
              <span className="bar-row__count">{count}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
