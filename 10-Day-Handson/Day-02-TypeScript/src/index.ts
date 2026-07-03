import { fetchEmployees, SaveEmployee }  from "./api";
import { addEmployee, updateEmployee, deleteEmployee, getEmployee } from "./employeeStore";
import { byDepartment, sortBySalaryDesc, activeEmployee,totalPayroll } from "./queries";
import { describeEmployee } from "./employee";
import type { Employee } from "./types";


const printList = (label: string, employees: Employee[]):void => {
    console.log(`\n----${label} ---`);
    employees.forEach((e) => console.log(`${describeEmployee(e)}`));
}

const main = async():Promise<void> => {
    try{
        // 1) Load from the mock API, then UNWRAP the payload with `.data`
        const loaded = await fetchEmployees();
        console.log(loaded.message);
        let employees: Employee[] = loaded.data;
        printList("Loaded from API", employees);
    
        // 2) CREATE
        employees = addEmployee(employees, {name: "Ethan", department: "Engineering", salary:70000});
        // getEmployee returns `Employee | undefined`, so TS forces us to check before using it:
        const ethan = getEmployee(employees, 5);
        if(ethan) console.log(`\n Added: ${describeEmployee(ethan)}`);
    
    
        // 3) UPDATE - give Alice (id 1) a raise
        employees = updateEmployee(employees, 1, {salary: 105000});
        const alice = getEmployee(employees,1);
        if(alice) console.log(`Alice's new salary : $${alice.salary}`);

        // 4) DELETE - remove Charlies (id 3)
        employees = deleteEmployee(employees,3);
        printList("After removing Charlies" , employees);


        // 5) FILTER  +  SORT (chained)
        printList(
            "Engineering (highest paid first)",
            sortBySalaryDesc(byDepartment(employees, "Engineering")),
        );
        console.log(`\n Active employees: ${activeEmployee(employees).length}`);
        console.log(`Total Payroll : $${totalPayroll(employees)}`)

        // 6) SAVE - success path
        const aliceToSave = getEmployee(employees, 1);
        if(aliceToSave){
            const result = await SaveEmployee(aliceToSave);
            console.log(`\n${result.message} (success = ${result.success})`);
        }

        // 7) ERROR Path - empty name makes saveEmployee throw -> caught below
        await SaveEmployee({id: 99, name: "", department: "IT", salary:0, active:true})
    }
    catch(err) {
        // In TS, a caught error type is unknown , Narrow ut before reading `.message`.
        const message = err instanceof Error ? err.message : String(err);
        console.log(`\n Caught an error (expecred) : ${message}`);
    }

};

main();