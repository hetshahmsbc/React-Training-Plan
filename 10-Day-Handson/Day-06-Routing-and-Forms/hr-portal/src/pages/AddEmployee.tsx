// Add employee page — "/employees/new" (React Hook Form).

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { Employee } from "../types";
import { useToast } from "../components/Toast";

interface EmployeeFormValues {
  name: string;
  email: string;
  age: number;
  phone: string;
  department: string;
  role: string;
}

interface AddEmployeeProps {
  onAdd: (employee: Employee) => void;
}

// just suggested values for the dropdown; department is a free string
const DEPARTMENTS = ["Engineering", "Sales", "Design", "Marketing", "HR", "Finance", "Support"];

export default function AddEmployee({ onAdd }: AddEmployeeProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>();

  function onSubmit(values: EmployeeFormValues) {
    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      ...values,
    };
    onAdd(newEmployee);
    showToast(`${newEmployee.name} was added to the team`, "success");
    navigate("/employees");
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Employee</h1>
          <p className="page-subtitle">Create a new team member record.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-grid">
          <div className="field field--full">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              className={errors.name ? "input--error" : ""}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name is too short" },
              })}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={errors.email ? "input--error" : ""}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              className={errors.phone ? "input--error" : ""}
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              className={errors.age ? "input--error" : ""}
              {...register("age", {
                required: "Age is required",
                valueAsNumber: true,
                min: { value: 18, message: "Must be at least 18" },
              })}
            />
            {errors.age && <span className="error">{errors.age.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              className={errors.department ? "input--error" : ""}
              {...register("department", { required: "Pick a department" })}
            >
              <option value="">-- Select --</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && <span className="error">{errors.department.message}</span>}
          </div>

          <div className="field field--full">
            <label htmlFor="role">Role / Job title</label>
            <input
              id="role"
              className={errors.role ? "input--error" : ""}
              {...register("role", { required: "Role is required" })}
            />
            {errors.role && <span className="error">{errors.role.message}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={() => navigate("/employees")}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={isSubmitting}>
            Save employee
          </button>
        </div>
      </form>
    </section>
  );
}
