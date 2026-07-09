// App — declare all your <Routes> here.

import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import type { Employee } from "./types";
import { fetchEmployees } from "./api";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import EmployeeDetail from "./pages/EmployeeDetail";
import AddEmployee from "./pages/AddEmployee";
import NotFound from "./pages/NotFound";
import "./App.css";

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // load employees from the API once, when the app first renders
  useEffect(() => {
    fetchEmployees()
      .then((data) => setEmployees(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  // add a new employee to the LOCAL list (called by the form)
  function addEmployee(employee: Employee) {
    setEmployees((prev) => [employee, ...prev]);
  }

  // remove an employee from the LOCAL list
  function deleteEmployee(id: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard employees={employees} loading={loading} error={error} />} />
        <Route
          path="employees"
          element={
            <EmployeeList
              employees={employees}
              loading={loading}
              error={error}
              onDelete={deleteEmployee}
            />
          }
        />
        <Route path="employees/new" element={<AddEmployee onAdd={addEmployee} />} />
        <Route
          path="employees/:id"
          element={<EmployeeDetail employees={employees} loading={loading} onDelete={deleteEmployee} />}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
