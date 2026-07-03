// --------------Part 4: Mock async API ---------

// A pretend database that only lives inside this file.

const FAKE_DB = [
  { id: 1, name: "Alice", department: "Engineering", salary: 95000, active: true },
  { id: 2, name: "Bob", department: "Sales", salary: 60000, active: true },
  { id: 3, name: "Charlie", department: "Engineering", salary: 820000, active: false },
  { id: 4, name: "Diana Roy", department: "HR", salary: 55000, active: true },
];

// delay(ms) returns a promise that resolves after `ms` milliseconds.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// fetchEmployees pretend to GET the list. `async` makes it return a Promise.
export const fetchEmployees = async () => {
  await delay(300); // pause, as if waiting for the network
  return FAKE_DB.map((e) => ({ ...e })); // return copies so caller can't mutate FAKE_DB
};

// saveEmployee pretends to save one. Throwing inside async = a rejected Promise.
export const saveEmployee = async (employee) => {
  await delay(300);
  if (!employee.name) {
    throw new Error("Cannot save an employee without a name");
  }
  return { ...employee, saved: true };
};
