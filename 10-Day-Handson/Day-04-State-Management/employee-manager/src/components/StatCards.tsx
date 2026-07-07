import type { Employee } from "../types";

interface StatCardsProps {
  employees: Employee[];
}

// Pure UI: shows summary numbers calculated from the employees list.
// This does NOT store anything in state — it's derived on every render.
function StatCards({ employees }: StatCardsProps) {
  const total = employees.length;
  const departments = new Set(employees.map((e) => e.department)).size;
  const payroll = employees.reduce((sum, e) => sum + e.salary, 0);
  const avg = total === 0 ? 0 : Math.round(payroll / total);

  const stats = [
    { label: "Employees", value: total, icon: "👥" },
    { label: "Departments", value: departments, icon: "🏢" },
    { label: "Total Payroll", value: `$${payroll.toLocaleString()}`, icon: "💰" },
    { label: "Avg Salary", value: `$${avg.toLocaleString()}`, icon: "📊" },
  ];

  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-icon">{s.icon}</div>
          <div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatCards;
