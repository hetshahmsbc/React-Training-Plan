// components.ts — functions that build HTML strings from typed data.

// Takes an Employee, returns a string.
const createEmployeeCard = (employee: Employee): string => {
  const { name, role, salary } = employee; //destructuring

  return `
  <div class = "employee-card">
  <h4> ${name}</h4>
  <p class="role">${role}</p>
  <p class = "salary">${salary.toLocaleString()}</p> 
  </div>
   `;
};

// Takes a departname (string), returns a string

const createDepartmentCard = (departmentName: string): string => {
  const members: Employee[] = employees.filter((emp) => emp.department === departmentName);

  const employeeCards: string = members.map(createEmployeeCard).join("");
  const totalSalary: number = members.reduce((sum, emp) => sum + emp.salary, 0);

  return `
    <section class="department-card">
      <header class="department-header">
        <h3>${departmentName}</h3>
        <span class="badge">${members.length} people</span>
      </header>
      <p class="dept-salary">Dept payroll: $${totalSalary.toLocaleString()}</p>
      <div class="employee-list">
        ${employeeCards}
      </div>
    </section>
  `;
};
