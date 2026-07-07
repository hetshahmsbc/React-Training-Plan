import type { Department, Employee } from "./types";

export const DEPARTMENTS: Department[] = ["Engineering", "Design", "Sales", "HR"];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "Aisha Khan",
    role: "Frontend Developer",
    department: "Engineering",
    salary: 85000,
  },
  {
    id: 2,
    name: "Ravi Patel",
    role: "UI Designer",
    department: "Design",
    salary: 72000,
  },
  {
    id: 3,
    name: "Meera Shah",
    role: "Account Executive",
    department: "Sales",
    salary: 68000,
  },
  {
    id: 4,
    name: "John Doe",
    role: "HR Manager",
    department: "HR",
    salary: 75000,
  },
];
