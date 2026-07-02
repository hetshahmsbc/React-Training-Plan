// =============================================================
// PART 2 — CRUD using arrays (Create, Read, Update, Delete)
// =============================================================
// THE GOLDEN RULE: we never change the original array.
// Every function takes the current list and returns a NEW list.
// This "make a copy" habit is exactly how React detects changes.
// -------------------------------------------------------------

import { createEmployee } from "./employee.js";

// CREATE ------------------------------------------------------
// Add a new employee and return a NEW array (old one is untouched).
export const addEmployee = (employees, data) => {
  // Work out the next id = (biggest existing id) + 1.
  // reduce() folds the whole list down to a single number.
  const nextId = employees.reduce((max, e) => Math.max(max, e.id), 0) + 1;

  const employee = createEmployee({ id: nextId, ...data });

  // Spread (...) copies every old employee, then we add the new one.
  return [...employees, employee];
};

// READ --------------------------------------------------------
// find() returns the FIRST match, or `undefined` if none matches.
export const getEmployee = (employees, id) => employees.find((e) => e.id === id);

// UPDATE ------------------------------------------------------
// map() builds a new array. For the one matching employee we return a
// copy with the changes merged in ({ ...e, ...changes }); everyone else
// is returned unchanged.
export const updateEmployee = (employees, id, changes) =>
  employees.map((e) => (e.id === id ? { ...e, ...changes } : e));

// DELETE ------------------------------------------------------
// filter() keeps everything EXCEPT the id we want to remove.
export const removeEmployee = (employees, id) => employees.filter((e) => e.id !== id);
