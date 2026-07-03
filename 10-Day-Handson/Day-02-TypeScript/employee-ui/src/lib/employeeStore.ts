import { createEmployee } from "./employee";
import type { Employee, NewEmployee } from "./types";

// CREATE
export const addEmployee = (employees: Employee[], data:NewEmployee): Employee[] => {
    const nextId = employees.reduce((max,e) => Math.max(max, e.id), 0) + 1;
    const employee = createEmployee({id:nextId, ...data});
    return [...employees, employee];
};

// READ - note the return type: it might not find anyone, so `Employee | undefined`
export const getEmployee = (employees: Employee[], id:number): Employee | undefined =>
    employees.find((e) => e.id === id);

// UPDATE = Partial<Employee> means "an object with SOME employee fields" (all optional)
export const updateEmployee = (
    employees: Employee[], id:number, changes: Partial<Employee>,
): Employee[] => employees.map((e) => (e.id === id ? {...e,...changes} : e));

// DELETE
export const deleteEmployee = (employees: Employee[], id:number): Employee[] =>
    employees.filter((e) => e.id !==id);
