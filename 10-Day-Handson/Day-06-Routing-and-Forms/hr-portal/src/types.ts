// An employee record, shaped to match what our API returns.
export interface Employee {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  department: string; // the API returns many values, so a plain string
  role: string;
  image?: string; // optional profile picture URL ( ? = may be missing )
}
