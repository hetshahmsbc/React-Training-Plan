// A Department can ONLY be one of these exact strings (a "union type").
export type Department = "Engineering" | "Design" | "Sales" | "HR";

// The shape of one employee
export interface Employee {
  id: number;
  name: string;
  role: string;
  department: Department;
  salary: number;
}
