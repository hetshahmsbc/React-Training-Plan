import type { Employee } from "./types";

// The raw shape DummyJson returns for one user (only this bits we need).
interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone: string;
  image: string;
  company: {
    department: string;
    title: string;
  };
}

interface ApiResponse {
  users: ApiUser[];
}

const BASE_URL = "https://dummyjson.com";

// Fetch users from the API and convert them into OUR Employee shape.

export async function fetchEmployees(): Promise<Employee[]> {
  const response = await fetch(`${BASE_URL}/users?limit=20`);

  // fetch does not throw on 404/500 - you must check response.ok yourself.
  if (!response.ok) {
    throw new Error(`Failed to load employees (status ${response.status})`);
  }

  const data: ApiResponse = await response.json();

  // map the API shape onto our own shape
  return data.users.map((user) => ({
    id: String(user.id),
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    age: user.age,
    phone: user.phone,
    department: user.company.department,
    role: user.company.title,
    image: user.image,
  }));
}
