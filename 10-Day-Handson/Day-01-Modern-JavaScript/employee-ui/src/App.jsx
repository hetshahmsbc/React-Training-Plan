import { useState, useEffect } from "react";
import { fetchEmployees } from "./lib/api.js";
import { addEmployee, updateEmployee, removeEmployee } from "./lib/employeeStore.js";
import { byDepartment, sortByName, sortBySalaryDesc, totalPayroll } from "./lib/queries.js";
import "./App.css";

// The departments the dropdown offers.
const DEPARTMENTS = ["Engineering", "Sales", "HR", "Marketing", "Finance", "Design"];

// A colour per department, used for the little badge in the table.
const DEPT_COLORS = {
  Engineering: "#6366f1",
  Sales: "#10b981",
  HR: "#f59e0b",
  Marketing: "#ec4899",
  Finance: "#0ea5e9",
  Design: "#8b5cf6",
};
const deptColor = (d) => DEPT_COLORS[d] || "#64748b";

// Turn 95000 into "$95,000".
const money = (n) => "$" + Number(n || 0).toLocaleString();

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- form state (shared by "Add" and "Edit") ---
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [salary, setSalary] = useState("");
  const [editingId, setEditingId] = useState(null); // null = adding, otherwise editing this id
  const [error, setError] = useState("");

  // --- toolbar state (search / filter / sort) ---
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [sortBy, setSortBy] = useState("salary");
  const [activeOnly, setActiveOnly] = useState(false);

  // Load once, from your mock API.
  useEffect(() => {
    fetchEmployees().then((data) => {
      setEmployees(data);
      setLoading(false);
    });
  }, []);

  const resetForm = () => {
    setName("");
    setDepartment(DEPARTMENTS[0]);
    setSalary("");
    setEditingId(null);
    setError("");
  };

  // Add OR update, depending on whether we're editing.
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError("Name is required.");
    const salaryNum = Number(salary) || 0;
    if (salaryNum < 0) return setError("Salary can't be negative.");

    if (editingId) {
      setEmployees(
        updateEmployee(employees, editingId, { name: trimmed, department, salary: salaryNum }),
      );
    } else {
      setEmployees(addEmployee(employees, { name: trimmed, department, salary: salaryNum }));
    }
    resetForm();
  };

  // Load a row's values into the form to edit it.
  const startEdit = (emp) => {
    setEditingId(emp.id);
    setName(emp.name);
    setDepartment(emp.department);
    setSalary(String(emp.salary));
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = (id) => {
    setEmployees(removeEmployee(employees, id));
    if (editingId === id) resetForm();
  };

  // Flip active/inactive right from the table.
  const toggleActive = (emp) => {
    setEmployees(updateEmployee(employees, emp.id, { active: !emp.active }));
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
      <header className="hero">
        <h1>👥 Employee Manager</h1>
        <p>Add, edit, filter, and manage your team — powered by your Day-1 JavaScript.</p>
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

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ethan Hunt"
            />
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
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="70000"
            />
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
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
                <td colSpan="5" className="empty">
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
