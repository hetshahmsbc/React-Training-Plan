// =============================================================
// PART 4 — Mock async API (Promises + async/await)
// =============================================================
// Real apps get data from a server, which takes time. Here we FAKE that
// with a small delay so you can practise Promises and async/await
// without needing a real backend.
// -------------------------------------------------------------

// A pretend database that only lives inside this file.
const FAKE_DB = [
  { id: 1, name: "Aisha Khan", department: "Engineering", salary: 95000, active: true },
  { id: 2, name: "Bhavin Patel", department: "Sales", salary: 60000, active: true },
  { id: 3, name: "Carlos Reyes", department: "Engineering", salary: 82000, active: false },
  { id: 4, name: "Diana Roy", department: "HR", salary: 55000, active: true },
];

// delay(ms) returns a Promise that resolves after `ms` milliseconds.
// This is how we simulate "the network took a moment".
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// fetchEmployees pretends to GET the employee list from a server.
// `async` makes this function return a Promise automatically.
export const fetchEmployees = async () => {
  await delay(300); // pause 300ms, as if waiting for the network

  // Return COPIES ({ ...e }) so callers can't accidentally mutate FAKE_DB.
  return FAKE_DB.map((e) => ({ ...e }));
};

// saveEmployee pretends to POST one employee back to the server.
// It can also FAIL — throwing inside an async function rejects the Promise,
// which the caller catches with try/catch.
export const saveEmployee = async (employee) => {
  await delay(200);

  if (!employee.name) {
    throw new Error("Cannot save an employee without a name");
  }

  return { ...employee, saved: true };
};
