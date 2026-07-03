// ------------- Part 2: CRUD using arrays ---------

import { createEmployee } from "./employee.js";

//CREATE - return a new array with the new employee added.

export const addEmployee = (employees, data) => {
  // next id = biggest existing id + 1. reduce() folds the list into one number.
  const nextId = employees.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  const employee = createEmployee({ id: nextId, ...data });
  return [...employees, employee]; // spreads copies the old list, then adds the new one
};

// READ - find() returns the FIRST match, or undefined if none.
export const getEmployee = (employees, id) => employees.find((e) => e.id === id);

// UPDATE - map() builds a new array; only the matching one gets copied + changed.
export const updateEmployee = (employees, id, changes) =>
  employees.map((e) => (e.id === id ? { ...e, ...changes } : e));

//  DELETE - filter() keeps everyone EXCEPT the id we remove.
export const removeEmployee = (employees, id) => employees.filter((e) => e.id !== id);
