// An INTERFACE describes the shape of an object.
// We declare Employee ONCE here and reuse it in every other file.

export interface Employee {
    id:number;
    name:string;
    department:string;
    salary:number;
    active:boolean;
}


// Data needes to CREATE an employee.
// The store assigns the `id` and `active` defaults to true.
// so we BUILD this type from Employee instead of repeating fields:

// Omit<Employee, "id" | "active"> = Employee without id and active
// &{active?:boolean} = add active back but optional (the ? = optional)

export type NewEmployee = Omit<Employee, "id" | "active"> & {active?:boolean};

 
// A GENERIC API response wrapper.
// <T> is a placeholder for "whatever type of data this response carries".
// ApiResponse<Employee>  --> Data is one employee
// ApiResponse<Employee[]> --> data is a LIST of employees
// Same Wrapper, different payloads - that's what "generic" means.

export interface ApiResponse<T>{
    success: boolean;
    data: T;
    message: string;
}