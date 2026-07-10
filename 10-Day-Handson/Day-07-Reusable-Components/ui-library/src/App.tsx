import { useEffect, useState } from "react";
import { Badge, Button, Input, Loader, Modal, Pagination, Select, Table } from "./components";
import useToggle from "./hooks/useToggle";
import usePagination from "./hooks/usePagination";
import "./App.css";

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const ROLES = ["Developer", "Designer", "Tester", "Manager", "HR"];

const ROLE_COLORS: Record<string, "blue" | "green" | "orange" | "purple" | "gray"> = {
  Developer: "blue",
  Designer: "purple",
  Tester: "orange",
  Manager: "green",
  HR: "gray",
};

const PAGE_SIZE = 5;

const initialEmployees: Employee[] = [
  { id: 1, name: "Amit Sharma", email: "amit@company.com", role: "Developer" },
  { id: 2, name: "Priya Patel", email: "priya@company.com", role: "Designer" },
  { id: 3, name: "Rahul Verma", email: "rahul@company.com", role: "Tester" },
  { id: 4, name: "Sneha Joshi", email: "sneha@company.com", role: "Developer" },
  { id: 5, name: "Karan Mehta", email: "karan@company.com", role: "Manager" },
  { id: 6, name: "Neha Singh", email: "neha@company.com", role: "Developer" },
  { id: 7, name: "Vikram Rao", email: "vikram@company.com", role: "Tester" },
  { id: 8, name: "Anjali Desai", email: "anjali@company.com", role: "HR" },
  { id: 9, name: "Rohan Kulkarni", email: "rohan@company.com", role: "Developer" },
  { id: 10, name: "Pooja Iyer", email: "pooja@company.com", role: "Designer" },
  { id: 11, name: "Arjun Nair", email: "arjun@company.com", role: "Developer" },
  { id: 12, name: "Kavita Reddy", email: "kavita@company.com", role: "Manager" },
  { id: 13, name: "Siddharth Malhotra", email: "siddharth@company.com", role: "Tester" },
  { id: 14, name: "Divya Menon", email: "divya@company.com", role: "Developer" },
  { id: 15, name: "Manish Gupta", email: "manish@company.com", role: "Designer" },
  { id: 16, name: "Ritika Bansal", email: "ritika@company.com", role: "HR" },
  { id: 17, name: "Aditya Chauhan", email: "aditya@company.com", role: "Developer" },
  { id: 18, name: "Shreya Pillai", email: "shreya@company.com", role: "Tester" },
  { id: 19, name: "Nikhil Saxena", email: "nikhil@company.com", role: "Developer" },
  { id: 20, name: "Tanvi Kapoor", email: "tanvi@company.com", role: "Designer" },
  { id: 21, name: "Harsh Trivedi", email: "harsh@company.com", role: "Manager" },
  { id: 22, name: "Ishita Bose", email: "ishita@company.com", role: "Developer" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");

  const formModal = useToggle();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Simulate fetching data from an API on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmployees(initialEmployees);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const searchText = search.trim().toLowerCase();
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchText) ||
      emp.email.toLowerCase().includes(searchText) ||
      emp.role.toLowerCase().includes(searchText)
  );

  const { currentItems, currentPage, totalPages, goToPage, startIndex, totalItems } =
    usePagination(filteredEmployees, PAGE_SIZE);

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole(ROLES[0]);
    setNameError("");
    setEmailError("");
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    formModal.open();
  };

  const openEditModal = (emp: Employee) => {
    resetForm();
    setEditingId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setRole(emp.role);
    formModal.open();
  };

  const validateForm = () => {
    let valid = true;

    if (name.trim() === "") {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError("");
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailTaken = employees.some(
      (emp) => emp.email.toLowerCase() === cleanEmail && emp.id !== editingId
    );

    if (cleanEmail === "") {
      setEmailError("Email is required");
      valid = false;
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      setEmailError("Enter a valid email address");
      valid = false;
    } else if (emailTaken) {
      setEmailError("This email is already in use");
      valid = false;
    } else {
      setEmailError("");
    }

    return valid;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setTimeout(() => {
      // Functional updates (prev => ...) so we never overwrite
      // changes that happened while this "request" was in flight
      if (editingId !== null) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editingId
              ? { ...emp, name: name.trim(), email: email.trim(), role }
              : emp
          )
        );
      } else {
        setEmployees((prev) => {
          // Highest existing id + 1 — length + 1 breaks after deletes
          const nextId = prev.length === 0 ? 1 : Math.max(...prev.map((emp) => emp.id)) + 1;
          return [...prev, { id: nextId, name: name.trim(), email: email.trim(), role }];
        });
      }
      setIsSaving(false);
      formModal.close();
      resetForm();
    }, 600);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Employee Directory</h1>
          <p>Built with our reusable component library</p>
        </div>
        <Button label="+ Add Employee" onClick={openAddModal} />
      </header>

      <div className="card">
        <div className="toolbar">
          <div className="toolbar-search">
            <Input
              value={search}
              onChange={setSearch}
              placeholder="Search by name, email or role..."
            />
          </div>
          <span className="toolbar-count">
            {filteredEmployees.length} of {employees.length} employees
          </span>
        </div>

        {isLoading ? (
          <div className="loader-wrap">
            <Loader size="large" />
            <p>Loading employees...</p>
          </div>
        ) : (
          <>
            <Table
              columns={[
                {
                  header: "Employee",
                  render: (emp: Employee) => (
                    <div className="emp-cell">
                      <div
                        className="avatar"
                        style={{ backgroundColor: `hsl(${(emp.id * 47) % 360}, 60%, 45%)` }}
                      >
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <div className="emp-name">{emp.name}</div>
                        <div className="emp-email">{emp.email}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Role",
                  render: (emp: Employee) => (
                    <Badge text={emp.role} color={ROLE_COLORS[emp.role] ?? "gray"} />
                  ),
                },
                {
                  header: "Actions",
                  render: (emp: Employee) => (
                    <div className="row-actions">
                      <Button label="Edit" variant="secondary" onClick={() => openEditModal(emp)} />
                      <Button label="Delete" variant="danger" onClick={() => setDeleteTarget(emp)} />
                    </div>
                  ),
                },
              ]}
              data={currentItems}
              rowKey={(emp) => emp.id}
              emptyMessage={
                search ? "No employees match your search" : "No employees yet — add one!"
              }
            />

            {totalItems > 0 && (
              <div className="table-footer">
                <span>
                  Showing {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, totalItems)} of{" "}
                  {totalItems}
                </span>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={formModal.isOn}
        title={editingId !== null ? "Edit Employee" : "Add Employee"}
        onClose={formModal.close}
      >
        <Input
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Enter full name"
          error={nameError}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="name@company.com"
          error={emailError}
        />
        <Select label="Role" value={role} onChange={setRole} options={ROLES} />
        <div className="modal-actions">
          {isSaving && <Loader />}
          <Button label="Cancel" variant="secondary" onClick={formModal.close} disabled={isSaving} />
          <Button
            label={isSaving ? "Saving..." : editingId !== null ? "Update" : "Save"}
            onClick={handleSave}
            disabled={isSaving}
          />
        </div>
      </Modal>

      <Modal
        isOpen={deleteTarget !== null}
        title="Delete Employee"
        onClose={() => setDeleteTarget(null)}
      >
        <p className="delete-text">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be
          undone.
        </p>
        <div className="modal-actions">
          <Button label="Cancel" variant="secondary" onClick={() => setDeleteTarget(null)} />
          <Button label="Delete" variant="danger" onClick={confirmDelete} />
        </div>
      </Modal>
    </div>
  );
}

export default App;
