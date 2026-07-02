// =============================================================
// RUNNER — ties all four parts together
// =============================================================
// Run it from the project root with:   npm run day1
// (or:  node 10-Day-Handson/day1-modern-js/src/index.js)
// -------------------------------------------------------------

// ES MODULE imports. Named exports are imported inside { braces }.
import { fetchEmployees, saveEmployee } from "./api.js";
import { addEmployee, updateEmployee, removeEmployee, getEmployee } from "./employeeStore.js";
import { byDepartment, sortBySalaryDesc, activeEmployees, totalPayroll } from "./queries.js";
import { describeEmployee } from "./employee.js";

// A small helper to print a list of employees nicely.
const printList = (label, employees) => {
  console.log(`\n${label}`);
  employees.forEach((e) => console.log(`  ${describeEmployee(e)}`));
};

// Everything runs inside an async function so we can use `await`.
const main = async () => {
  try {
    // 1) LOAD initial data from the mock API (await pauses until it arrives)
    let employees = await fetchEmployees();
    printList("Loaded from API:", employees);

    // 2) CREATE — add a new engineer
    employees = addEmployee(employees, {
      name: "Ethan Wong",
      department: "Engineering",
      salary: 70000,
    });
    console.log(`\nAdded: ${describeEmployee(getEmployee(employees, 5))}`);

    // 3) UPDATE — give Aisha (id 1) a raise
    employees = updateEmployee(employees, 1, { salary: 105000 });
    console.log(`Aisha's new salary: $${getEmployee(employees, 1).salary}`);

    // 4) DELETE — remove Carlos (id 3)
    employees = removeEmployee(employees, 3);
    console.log(`After removing Carlos, employee count: ${employees.length}`);

    // 5) FILTER + SORT — engineers, highest paid first (chained together)
    printList("Engineering (highest paid first):", sortBySalaryDesc(byDepartment(employees, "Engineering")));

    console.log(`\nActive employees: ${activeEmployees(employees).length}`);
    console.log(`Total payroll: $${totalPayroll(employees)}`);

    // 6) SAVE via the mock API — the success path
    const result = await saveEmployee(getEmployee(employees, 1));
    console.log(`\nSaved Aisha successfully? ${result.saved}`);

    // 7) The ERROR path — saving without a name rejects the Promise,
    //    and try/catch below catches it.
    await saveEmployee({ department: "IT" });
  } catch (err) {
    console.log(`\nCaught an error (this is expected): ${err.message}`);
  }
};

main();
