import type { Employee, ApiResponse } from "./types";

const FAKE_DB: Employee[] = [
  { id: 1, name: "Alice", department: "Engineering", salary: 95000, active: true },
  { id: 2, name: "Bob", department: "Sales", salary: 60000, active: true },
  { id: 3, name: "Charlie", department: "Engineering", salary: 820000, active: false },
  { id: 4, name: "Diana Roy", department: "HR", salary: 55000, active: true },
];

const delay = (ms:number):Promise<void> =>
    new Promise((resolve) => setTimeout(resolve,ms));

export const fetchEmployees = async() : Promise<ApiResponse<Employee[]>> => {
    await delay(300);
    return{
        success:true,
        data:FAKE_DB.map((e) => ({...e})),
        message: "Employees Loaded",
    };
};

export const SaveEmployee = async (employee: Employee): Promise<ApiResponse<Employee>> => {
    await delay(300);
    return{
        success:true,
        data: employee,
        message: `Saved ${employee.name}`,
    };
};