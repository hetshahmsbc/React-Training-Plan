import type { Employee } from "./types";

// --------- Filtering ------------
export const byDepartment = (employees: Employee[], department: string): Employee[] => 
    employees.filter((e) => e.department === department);

export const activeEmployee = (employees:Employee[]): Employee[] =>
    employees.filter((e) => e.active);

export const earningAtLeast = (employees:Employee[], minSalary:number): Employee[] => 
    employees.filter((e) => e.salary > minSalary);

// ------ Sorting --------- 

export const sortByName = (employees: Employee[]): Employee[] =>
[...employees].sort((a,b) => a.name.localeCompare(b.name));


export const sortBySalaryDesc =(employee: Employee[]): Employee[] => 
[...employee].sort((a,b) => b.salary - a.salary);

// ---------- AGGREGATE -------------

export const totalPayroll = (employees:Employee[]): number => 
    employees.reduce((sum, e) => sum + e.salary, 0);