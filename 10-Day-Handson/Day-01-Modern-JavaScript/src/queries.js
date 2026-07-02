// ----------- Part 3: Filtering & Sorting --------------

// ------ Filtering -------
export const byDepartment = (employees, department) => 
    employees.filter((e) => e.department === department);

export const activeEmployee = (employees) => 
    employees.filter((e) => e.active);

export const earningAtLeast = (employees, salary) => 
    employees.filter((e) => e.salary >= minSalary);

// ------ Sorting -------
export const sortByName = (employees) =>  
[...employees].sort((a,b) => a.name.localeCompare(b.name)); // A ->z

export const sortBySalaryDesc = (employees) => 
[...employees].sort((a,b) => b.salary - a.salary); // highest first


// ----------- AGGREGATE ----------
export const totalPayroll = (employees) => employees.reduce((sum,e) => sum = sum + e.salary, 0);

