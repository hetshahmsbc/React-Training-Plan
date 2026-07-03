// ------------- Part 1: the Employee model --------------

// createEmployee builds ONE employee object.
// The argument is a single object that we DESTRUCTURE ({id,name, ...}).
// `active = true` is a DEFAULT - used only when `active` is not passed.

export const createEmployee = ({ id, name, department, salary, active = true }) => {
  // Validate early so bad data fails loudly instead of causing weird bugs.
  if (!name) {
    throw new Error("Employee must have a name");
  }
  if (typeof salary === "number" && salary < 0) {
    throw new Error("Salary cannot be negative");
  }

  // Return a brand new plain object.
  return { id, name, department, salary, active };
};

// Turn one employee into a readable line using a TEMPLATE LITERAL (backticks + ${ }).
export const describeEmployee = (employee) =>
  `#${employee.id} ${employee.name} - ${employee.department}, $${employee.salary}${
    employee.active ? "" : " (inactive)"
  }`;
