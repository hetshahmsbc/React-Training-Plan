// app.ts — builds the Dashboard summary and renders everything.

const createDashboard = (): string => {
  const totalEmployees: number = employees.length;
  const totalDepartments: number = departments.length;
  const totalPayroll: number = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgSalary: number = Math.round(totalPayroll / totalEmployees);

  // Union type: value can be a string or A number
  const stats: { label: string; value: string | number }[] = [
    { label: "Employees", value: totalEmployees },
    { label: "Departments", value: totalDepartments },
    { label: "Total Payroll", value: `$${totalPayroll.toLocaleString()}` },
    { label: "Avg Salary", value: `$${avgSalary.toLocaleString()}` },
  ];

  const statBoxes = stats
    .map(
      ({ label, value }) => `
      <div class="stat">
        <span class="stat-value">${value}</span>
        <span class="stat-label">${label}</span>
      </div>
    `,
    )
    .join("");

  return `<div class = "dashboard-stats">${statBoxes}</div>`;
};

// ": void" means "returns nothing".
const renderApp = (): void => {
  const root = document.getElementById("app");

  // getElementById might be null, so Typescript makes us check.
  if (!root) return;

  const departmentCards = departments.map(createDepartmentCard).join("");

  root.innerHTML = `
    <h1> Company Dashboard</h1>
    ${createDashboard()}
    <div class = "departments">${departmentCards}</div>
    `;
};

renderApp();
