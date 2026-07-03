import type {Employee, NewEmployee} from "./types";

// createEmployee build ONE employee.It takes the new-employee data plus an id,
// and promises to return a full Employee (the `: Employee after the argument).

export const createEmployee = (input: NewEmployee &{id:number}) : Employee =>
{
    const {id, name,department,salary,active = true} = input;

    if(!name){
        throw new Error ("Employee must have a name");
    }
    if(salary < 0){
        throw new Error("Salary cannot be negative");
    }

    return {id,name,department,salary,active};
};

// Turn one Employee into a readable line. Takes an employee, returns a string.
export const describeEmployee = (employee: Employee) : string =>
    `#${employee.id} ${employee.name} - ${employee.department}, $${employee.salary}${
        employee.active ? "" : " (inactive)"
    }`;
