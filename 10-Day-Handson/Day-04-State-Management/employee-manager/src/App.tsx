import { useState } from "react";
import type { EmployeeFormValues } from "./components/EmployeeForm";
import type { Employee } from "./types";
import { DEPARTMENTS, INITIAL_EMPLOYEES } from "./data";
import EmployeeForm from "./components/EmployeeForm";
import Filters from "./components/Filters";
import EmployeeList from "./components/EmployeeList";
import StatCards from "./components/StatCards";
import "./App.css";

const EMPTY_FORM: EmployeeFormValues = {
  name: "",
  role: "",
  department: "Engineering",
  salary: "",
};

// The sidebar menu items, as data instead of hard-coded JSX
const NAV_ITEMS = [
  { label: "Employees", icon: "👥" },
  { label: "Dashboard", icon: "📊" },
  { label: "Departments", icon: "🏢" },
  { label: "Settings", icon: "⚙️" },
];

function App() {
  // ---- STATE (all "lifted up" here so children can share it) -----
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [form, setForm] = useState<EmployeeFormValues>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null); // null = we're adding, not editing
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [activeNav, setActiveNav] = useState("Employees"); // which sidebar item is highlighted

  // ---- FORM HANDLERS -----
  // Update ONE field of the form object. [field] is a "computed key".
  const handleFieldChange = (field: keyof EmployeeFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value })); // ...prev = keep the other fields
  };

  const handleSubmit = () => {
    if (form.name.trim() === "" || form.salary.trim() === "") {
      alert("Please enter at lease a name and a salary");
      return;
    }

    const data = {
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department as Employee["department"],
      salary: Number(form.salary),
    };

    if (editingId === null) {
      // CREATE : add a new employee (Date.now() gives a unique id)
      setEmployees((prev) => [...prev, { id: Date.now(), ...data }]);
    } else {
      // UPDATE: replace the matching employee, kept the rest unchanged
      setEmployees((prev) => prev.map((emp) => (emp.id === editingId ? { ...emp, ...data } : emp)));
      setEditingId(null);
    }
    setForm(EMPTY_FORM); // Clear the form
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      role: employee.role,
      department: employee.department,
      salary: String(employee.salary), // number -> String for the input
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id != id));
    if (editingId === id) handleCancel();
  };

  // -------- DERIVED DATA ---------
  // Computed fresh on EVERY render. Rule: never store in state what you can calculate.
  const viisibleEmployee = employees
    .filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase()))
    .filter((emp) => (departmentFilter === "All" ? true : emp.department === departmentFilter));

  return (
    <div className="layout">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">HR</span>
          <span className="brand-name">PeopleHub</span>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <span
              key={item.label}
              className={activeNav === item.label ? "nav-item active" : "nav-item"}
              onClick={() => setActiveNav(item.label)}
            >
              {item.icon} {item.label}
            </span>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="avatar">HS</div>
          <div>
            <div className="who">Het Shah</div>
            <div className="muted small">Admin</div>
          </div>
        </div>
      </aside>

      {/* ---------- MAIN ---------- */}
      <main className="main">
        <header className="topbar">
          <div>
            <h1>Employees</h1>
            <p className="muted">Manage your team members</p>
          </div>
        </header>

        <StatCards employees={employees} />

        <div className="content-grid">
          <EmployeeForm
            values={form}
            isEditing={editingId !== null}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />

          <div className="list-panel">
            <Filters
              search={search}
              departmentFilter={departmentFilter}
              departments={DEPARTMENTS}
              onSearchChange={setSearch}
              onDepartmentChange={setDepartmentFilter}
            />
            <EmployeeList employees={viisibleEmployee} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
