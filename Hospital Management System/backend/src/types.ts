// Shared record shapes used across the mock API.
// Every record has a numeric `id`; the generic store fills that in on create.

export interface WithId {
  id: number;
}

export interface Doctor extends WithId {
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  phone: string;
  fee: number;
  available: boolean;
}

export interface Patient extends WithId {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dob: string; // ISO date
  bloodGroup: string;
}

export interface Appointment extends WithId {
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  date: string; // ISO date
  time: string; // HH:mm
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Medicine extends WithId {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export interface OrderItem {
  medicineId: number;
  name: string;
  qty: number;
  price: number;
}

export interface Order extends WithId {
  patientName: string;
  items: OrderItem[];
  total: number;
  status: 'placed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Prescription extends WithId {
  appointmentId: number;
  patientName: string;
  doctorName: string;
  medicineIds: number[]; // real medicines chosen from the catalog (drives "Buy at Pharmacy")
  medicines: string; // human-readable dosage instructions
  notes: string;
  date: string;
}

export interface Invoice extends WithId {
  patientName: string;
  doctorName?: string; // doctor from the patient's appointment
  appointmentId?: number; // auto-derived from the patient's appointment
  amount: number;
  status: 'paid' | 'unpaid';
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // plain text — this is a mock server only
  role: 'admin' | 'doctor' | 'patient';
  doctorId?: number; // set for doctor users → their record in `doctors`
  patientId?: number; // set for patient users → their record in `patients`
}
