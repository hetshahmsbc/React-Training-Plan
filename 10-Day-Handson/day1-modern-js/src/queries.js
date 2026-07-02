// =============================================================
// PART 3 — Filtering & Sorting
// =============================================================
// These are read-only "questions" we ask about the list.
// filter() and map() already return new arrays, so they are safe.
// sort() is the dangerous one — it changes the array in place — so we
// always copy first with [...employees] before sorting.
// -------------------------------------------------------------

// FILTERING ---------------------------------------------------

// Keep only employees in a given department.
export const byDepartment = (employees, department) =>
  employees.filter((e) => e.department === department);

// Keep only the active employees.
export const activeEmployees = (employees) => employees.filter((e) => e.active);

// Keep only employees earning at least `minSalary`.
export const earningAtLeast = (employees, minSalary) =>
  employees.filter((e) => e.salary >= minSalary);

// SORTING -----------------------------------------------------
// NOTE the [...employees] copy — without it, sort() would scramble the
// caller's original array (a classic Day-1 bug).

// Sort by name A→Z. localeCompare compares two strings alphabetically.
export const sortByName = (employees) =>
  [...employees].sort((a, b) => a.name.localeCompare(b.name));

// Sort by salary, highest first. For numbers, subtract to compare.
export const sortBySalaryDesc = (employees) =>
  [...employees].sort((a, b) => b.salary - a.salary);

// AGGREGATE ---------------------------------------------------
// reduce() adds up every salary into a single total.
export const totalPayroll = (employees) => employees.reduce((sum, e) => sum + e.salary, 0);
