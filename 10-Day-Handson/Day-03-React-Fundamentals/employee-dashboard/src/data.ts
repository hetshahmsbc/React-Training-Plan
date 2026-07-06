// data.ts — the data, plus a "type" describing its shape.

// An interface describe what an Employee object must look like.
interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  salary: number;
}

// ": Employee[]" means "an array of Employee objects".
const employees: Employee[] = [
  {
    id: 1,
    name: "Aisha Khan",
    role: "Frontend Developer",
    department: "Engineering",
    salary: 75000,
  },
  {
    id: 2,
    name: "Rohan Mehta",
    role: "Backend Developer",
    department: "Engineering",
    salary: 82000,
  },
  { id: 3, name: "Priya Sharma", role: "UI/UX Designer", department: "Design", salary: 68000 },
  { id: 4, name: "David Lee", role: "HR Manager", department: "Human Resources", salary: 71000 },
  { id: 5, name: "Sara Ali", role: "Recruiter", department: "Human Resources", salary: 55000 },
  { id: 6, name: "Vikram Nair", role: "Product Manager", department: "Product", salary: 95000 },
];

// ":string[]" means "an array of strings"
const departments: string[] = ["Engineering", "Design", "Human Resources", "Product"];
