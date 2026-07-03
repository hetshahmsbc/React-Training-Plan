// ------------ the runner (ties everything together) -------

import { fetchEmployees, saveEmployee } from "./api.js";
import { addEmployee, updateEmployee, removeEmployee, getEmployee } from "./employeeStore.js";
import { byDepartment, sortBySalaryDesc, activeEmployee, totalPayroll } from "./queries.js";
import { describeEmployee } from "./employee.js";

// -------------- Part 5: The runner -----------------

// Small helper to print nicely
const printList = (label, employees) => {
  console.log(`\n--- ${label} ---`);
  employees.forEach((e) => console.log(`   ${describeEmployee(e)}`));
};

// Everything runs inside an async function so we can use `await`.
const main = async () => {
  try {
    // 1) Load from the mock API (await pauses untill data arrives)
    let employees = await fetchEmployees();
    printList("Loaded from API", employees);

    // 2) CREATE
    employees = addEmployee(employees, { name: "Ethan", department: "Engineering", salary: 70000 });
    console.log(`\nAdded: ${describeEmployee(getEmployee(employees, 5))}`);

    // 3) UPDATE - give Alice (id 1) a raise
    employees = updateEmployee(employees, 1, { salary: 105000 });
    console.log(`Alice's new salary : $${getEmployee(employees, 1).salary}`);

    // 4)DELETE - remove Charlie (id 3)
    employees = removeEmployee(employees, 3);
    console.log(`\nRemoved Charlie. New list:`);
    printList("After removing Charlie", employees);

    // 5) FILTER + SORT (Chained)
    printList(
      "Engineering (highest paid first):",
      sortBySalaryDesc(byDepartment(employees, "Engineering")),
    );
    console.log(`\nActive employees: ${activeEmployee(employees).length}`);
    console.log(`Total payroll: $${totalPayroll(employees)}`);

    // 6) SAVE via mock API - success path
    const result = await saveEmployee(getEmployee(employees, 1));
    console.log(`\nSaved Alice successfully? ${result.saved}`);

    // 7) ERROR path - no name -> rejects -> caught below
    await saveEmployee({ department: "IT" });
  } catch (err) {
    console.log(`\n Caught an error (expected): ${err.message}`);
  }
};

main();
