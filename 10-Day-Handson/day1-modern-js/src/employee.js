// =============================================================
// PART 1 — The Employee "model"
// =============================================================
// In plain JavaScript we do NOT need a class for a simple data shape.
// A small "factory function" that returns a plain object is enough.
// This object is exactly the kind of data you will later pass around
// as React "props".
// -------------------------------------------------------------

// createEmployee builds ONE employee object.
//
// Notice the argument is a single object `{ ... }` that we destructure.
// This lets the caller pass fields in any order and skip optional ones.
// `active = true` is a DEFAULT value — used only when `active` is missing.
export const createEmployee = ({ id, name, department, salary, active = true }) => {
  // Validate early so bad data fails loudly instead of causing weird bugs later.
  if (!name) {
    throw new Error("Employee needs a name");
  }
  if (salary != null && salary < 0) {
    throw new Error("Salary cannot be negative");
  }

  // Return a brand-new plain object. We never mutate anything here.
  return { id, name, department, salary, active };
};

// describeEmployee turns one employee into a readable line of text.
// This uses a TEMPLATE LITERAL (backticks + ${ }) instead of "a" + b + "c".
export const describeEmployee = (employee) =>
  `#${employee.id} ${employee.name} — ${employee.department}, $${employee.salary}${
    employee.active ? "" : " (inactive)"
  }`;
