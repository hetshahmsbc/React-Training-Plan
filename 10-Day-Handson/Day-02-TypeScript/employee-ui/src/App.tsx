import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { fetchEmployees, SaveEmployee } from "./lib/api";
import { addEmployee, updateEmployee, deleteEmployee, getEmployee } from "./lib/employeeStore";
import { byDepartment, sortByName, sortBySalaryDesc, totalPayroll } from "./lib/queries";
import type { Employee } from "./lib/types";
import "./App.css";

// The departments the dropdown offers.
const DEPARTMENTS = ["Engineering", "Sales", "HR", "Marketing", "Finance", "Design"];

// A colour per department, used for the little badge in the table.
const DEPT_COLORS: Record<string, string> = {
  Engineering: "#6366f1",
  Sales: "#10b981",
  HR: "#f59e0b",
  Marketing: "#ec4899",
  Finance: "#0ea5e9",
  Design: "#8b5cf6",
};
const deptColor = (d: string): string => DEPT_COLORS[d] || "#64748b";

// Turn 95000 into "$95,000".
const money = (n: number): string => "$" + Number(n || 0).toLocaleString();

// A single notification. `type` decides its colour.
type Toast = { id: number; type: "success" | "error" | "info"; message: string };

// Which form fields currently have a validation problem.
type FormErrors = { name?: string; salary?: string };

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // --- form state (shared by "Add" and "Edit") ---
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [salary, setSalary] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null); // null = adding, otherwise editing this id
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  // --- toolbar state (search / filter / sort) ---
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [sortBy, setSortBy] = useState("salary");
  const [activeOnly, setActiveOnly] = useState(false);

  // --- notifications (toasts) ---
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextToastId = useRef(1);

  const pushToast = (type: Toast["type"], message: string) => {
    const id = nextToastId.current++;
    setToasts((list) => [...list, { id, type, message }]);
    // auto-dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 3500);
  };
  const dismissToast = (id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  };

  // Load once, from YOUR mock API. fetchEmployees() returns ApiResponse<Employee[]>,
  // so we read `.data` to get the list — your generic wrapper in action.
  useEffect(() => {
    fetchEmployees().then((res) => {
      setEmployees(res.data);
      setLoading(false);
    });
  }, []);

  const resetForm = () => {
    setName("");
    setDepartment(DEPARTMENTS[0]);
    setSalary("");
    setEditingId(null);
    setErrors({});
  };

  // Check every field and return the problems found (empty object = all good).
  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const trimmed = name.trim();
    if (!trimmed) next.name = "Name is required.";
    else if (trimmed.length < 2) next.name = "Name must be at least 2 characters.";

    if (salary.trim() === "") next.salary = "Salary is required.";
    else if (Number.isNaN(Number(salary))) next.salary = "Salary must be a number.";
    else if (Number(salary) < 0) next.salary = "Salary can't be negative.";

    return next;
  };

  // Add OR update, then persist through YOUR SaveEmployee and notify.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return; // stop if anything is invalid

    const trimmed = name.trim();
    const salaryNum = Number(salary);

    try {
      setSaving(true);

      // 1) update the local list with YOUR store functions
      const updatedList =
        editingId !== null
          ? updateEmployee(employees, editingId, { name: trimmed, department, salary: salaryNum })
          : addEmployee(employees, { name: trimmed, department, salary: salaryNum });
      setEmployees(updatedList);

      // 2) find the employee we just added/updated
      const savedEmp =
        editingId !== null
          ? getEmployee(updatedList, editingId)
          : updatedList[updatedList.length - 1];

      // 3) persist it via YOUR async API and show its ApiResponse.message
      if (savedEmp) {
        const res = await SaveEmployee(savedEmp);
        pushToast("success", res.message); // e.g. "Saved Ethan"
      }

      resetForm();
    } catch (err) {
      // If your logic throws (e.g. bad data), surface it as an error toast.
      pushToast("error", err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // Load a row's values into the form to edit it.
  const startEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setName(emp.name);
    setDepartment(emp.department);
    setSalary(String(emp.salary));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = (id: number) => {
    const emp = getEmployee(employees, id); // YOUR read function, used to name the toast
    setEmployees(deleteEmployee(employees, id));
    if (editingId === id) resetForm();
    if (emp) pushToast("info", `Deleted ${emp.name}.`);
  };

  // Flip active/inactive right from the table.
  const toggleActive = (emp: Employee) => {
    setEmployees(updateEmployee(employees, emp.id, { active: !emp.active }));
    pushToast("info", `${emp.name} is now ${emp.active ? "inactive" : "active"}.`);
  };

  // Build the list to show: search -> department -> active-only -> sort.
  let visible = employees.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
  if (filterDept !== "All") visible = byDepartment(visible, filterDept);
  if (activeOnly) visible = visible.filter((e) => e.active);
  if (sortBy === "name") visible = sortByName(visible);
  else if (sortBy === "salary") visible = sortBySalaryDesc(visible);
  else if (sortBy === "salary-asc") visible = [...sortBySalaryDesc(visible)].reverse();

  // Stats come from the FULL list, not the filtered view.
  const activeCount = employees.filter((e) => e.active).length;
  const payroll = totalPayroll(employees);
  const avg = employees.length ? Math.round(payroll / employees.length) : 0;

  // Filter dropdown = "All" + known departments + any others already in the data.
  const filterOptions = [
    "All",
    ...new Set([...DEPARTMENTS, ...employees.map((e) => e.department)]),
  ];

  if (loading) {
    return (
      <div className="app">
        <p className="empty">Loading employees…</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* notifications */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
            <button className="toast-x" onClick={() => dismissToast(t.id)} aria-label="Dismiss">
              ×
            </button>
          </div>
        ))}
      </div>

      <header className="hero">
        <h1>👥 Employee Manager</h1>
        <p>Add, edit, filter, and manage your team — powered by your Day-2 TypeScript.</p>
      </header>

      <section className="stats">
        <div className="stat">
          <div className="label">Employees</div>
          <div className="value">{employees.length}</div>
        </div>
        <div className="stat">
          <div className="label">Active</div>
          <div className="value">{activeCount}</div>
        </div>
        <div className="stat">
          <div className="label">Total Payroll</div>
          <div className="value">{money(payroll)}</div>
        </div>
        <div className="stat">
          <div className="label">Avg Salary</div>
          <div className="value">{money(avg)}</div>
        </div>
      </section>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            Name
            <input
              className={errors.name ? "invalid" : ""}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. Ethan Hunt"
            />
            {errors.name && <span className="field-error">⚠️ {errors.name}</span>}
          </label>
          <label className="field">
            Department
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Salary
            <input
              type="number"
              className={errors.salary ? "invalid" : ""}
              value={salary}
              onChange={(e) => {
                setSalary(e.target.value);
                if (errors.salary) setErrors((prev) => ({ ...prev, salary: undefined }));
              }}
              placeholder="70000"
            />
            {errors.salary && <span className="field-error">⚠️ {errors.salary}</span>}
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editingId !== null ? "Update" : "Add"}
            </button>
            {editingId !== null && (
              <button type="button" className="btn btn-ghost" onClick={resetForm} disabled={saving}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="toolbar">
        <input
          className="grow"
          placeholder="🔍 Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          {filterOptions.map((d) => (
            <option key={d} value={d}>
              {d === "All" ? "All departments" : d}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="salary">Salary: high → low</option>
          <option value="salary-asc">Salary: low → high</option>
          <option value="name">Name: A → Z</option>
        </select>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Active only
        </label>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((e) => (
              <tr key={e.id}>
                <td>
                  <strong>{e.name}</strong>
                </td>
                <td>
                  <span className="badge" style={{ background: deptColor(e.department) }}>
                    {e.department}
                  </span>
                </td>
                <td>{money(e.salary)}</td>
                <td>
                  <button
                    className={`pill ${e.active ? "active" : "inactive"}`}
                    onClick={() => toggleActive(e)}
                  >
                    {e.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(e)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(e.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  No employees match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
