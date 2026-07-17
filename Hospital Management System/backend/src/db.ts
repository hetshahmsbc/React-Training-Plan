// In-memory "database". Data lives in these arrays and resets every time the
// server restarts. That is fine for a training project — no real DB to install.

import type {
  Doctor,
  Patient,
  Appointment,
  Medicine,
  Order,
  Prescription,
  Invoice,
  User,
} from './types';

// Demo accounts, one per role. The doctor/patient are linked (by name + id) to
// the seeded records below so their scoped views have data.
export const users: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@hospital.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Aisha Khan', email: 'aisha.khan@hospital.com', password: 'doctor123', role: 'doctor', doctorId: 1 },
  { id: 3, name: 'Vikram Rao', email: 'vikram.rao@example.com', password: 'patient123', role: 'patient', patientId: 1 },
];

export const doctors: Doctor[] = [
  { id: 1, firstName: 'Aisha', lastName: 'Khan', specialization: 'Cardiology', email: 'aisha.khan@hospital.com', phone: '+91 90000 11111', fee: 800, available: true },
  { id: 2, firstName: 'Rohan', lastName: 'Mehta', specialization: 'Orthopedics', email: 'rohan.mehta@hospital.com', phone: '+91 90000 22222', fee: 700, available: true },
  { id: 3, firstName: 'Sara', lastName: 'Verma', specialization: 'Dermatology', email: 'sara.verma@hospital.com', phone: '+91 90000 33333', fee: 600, available: false },
  { id: 4, firstName: 'Imran', lastName: 'Sheikh', specialization: 'Pediatrics', email: 'imran.sheikh@hospital.com', phone: '+91 90000 44444', fee: 650, available: true },
  { id: 5, firstName: 'Neha', lastName: 'Patel', specialization: 'Neurology', email: 'neha.patel@hospital.com', phone: '+91 90000 55555', fee: 900, available: true },
  { id: 6, firstName: 'Arjun', lastName: 'Reddy', specialization: 'General Medicine', email: 'arjun.reddy@hospital.com', phone: '+91 90000 66666', fee: 500, available: true },
  { id: 7, firstName: 'Meera', lastName: 'Iyer', specialization: 'Gynecology', email: 'meera.iyer@hospital.com', phone: '+91 90000 77777', fee: 750, available: true },
  { id: 8, firstName: 'Vivek', lastName: 'Nanda', specialization: 'ENT', email: 'vivek.nanda@hospital.com', phone: '+91 90000 88888', fee: 550, available: false },
  { id: 9, firstName: 'Fatima', lastName: 'Ali', specialization: 'Cardiology', email: 'fatima.ali@hospital.com', phone: '+91 90000 99999', fee: 850, available: true },
  { id: 10, firstName: 'Sanjay', lastName: 'Gupta', specialization: 'Orthopedics', email: 'sanjay.gupta@hospital.com', phone: '+91 90000 10101', fee: 700, available: true },
];

export const patients: Patient[] = [
  { id: 1, firstName: 'Vikram', lastName: 'Rao', email: 'vikram.rao@example.com', phone: '+91 98000 10001', gender: 'male', dob: '1990-04-12', bloodGroup: 'O+' },
  { id: 2, firstName: 'Priya', lastName: 'Nair', email: 'priya.nair@example.com', phone: '+91 98000 10002', gender: 'female', dob: '1985-11-30', bloodGroup: 'A+' },
  { id: 3, firstName: 'Karan', lastName: 'Singh', email: 'karan.singh@example.com', phone: '+91 98000 10003', gender: 'male', dob: '2001-01-05', bloodGroup: 'B+' },
  { id: 4, firstName: 'Ananya', lastName: 'Desai', email: 'ananya.desai@example.com', phone: '+91 98000 10004', gender: 'female', dob: '1994-07-22', bloodGroup: 'AB+' },
  { id: 5, firstName: 'Rahul', lastName: 'Joshi', email: 'rahul.joshi@example.com', phone: '+91 98000 10005', gender: 'male', dob: '1988-03-17', bloodGroup: 'O-' },
  { id: 6, firstName: 'Sneha', lastName: 'Kulkarni', email: 'sneha.kulkarni@example.com', phone: '+91 98000 10006', gender: 'female', dob: '1998-12-02', bloodGroup: 'B-' },
  { id: 7, firstName: 'Amit', lastName: 'Chowdhury', email: 'amit.chowdhury@example.com', phone: '+91 98000 10007', gender: 'male', dob: '1979-09-09', bloodGroup: 'A-' },
  { id: 8, firstName: 'Divya', lastName: 'Menon', email: 'divya.menon@example.com', phone: '+91 98000 10008', gender: 'female', dob: '2003-05-28', bloodGroup: 'O+' },
  { id: 9, firstName: 'Rohit', lastName: 'Sharma', email: 'rohit.sharma@example.com', phone: '+91 98000 10009', gender: 'male', dob: '1992-10-14', bloodGroup: 'AB-' },
  { id: 10, firstName: 'Kavya', lastName: 'Pillai', email: 'kavya.pillai@example.com', phone: '+91 98000 10010', gender: 'female', dob: '1996-02-19', bloodGroup: 'B+' },
  { id: 11, firstName: 'Manish', lastName: 'Agarwal', email: 'manish.agarwal@example.com', phone: '+91 98000 10011', gender: 'male', dob: '1983-08-06', bloodGroup: 'A+' },
  { id: 12, firstName: 'Ishita', lastName: 'Bose', email: 'ishita.bose@example.com', phone: '+91 98000 10012', gender: 'female', dob: '2000-11-25', bloodGroup: 'O+' },
];

export const appointments: Appointment[] = [
  { id: 1, patientId: 1, patientName: 'Vikram Rao', doctorId: 1, doctorName: 'Aisha Khan', date: '2026-07-20', time: '10:30', reason: 'Chest pain check-up', status: 'scheduled' },
  { id: 2, patientId: 2, patientName: 'Priya Nair', doctorId: 3, doctorName: 'Sara Verma', date: '2026-07-18', time: '15:00', reason: 'Skin allergy', status: 'completed' },
];

export const medicines: Medicine[] = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', price: 25, stock: 120, description: 'Fever and mild pain relief tablet.' },
  { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 90, stock: 60, description: 'Broad-spectrum antibiotic capsule.' },
  { id: 3, name: 'Cetirizine 10mg', category: 'Allergy', price: 40, stock: 200, description: 'Antihistamine for allergy relief.' },
  { id: 4, name: 'Vitamin C 1000mg', category: 'Supplement', price: 150, stock: 80, description: 'Immunity support effervescent tablet.' },
  { id: 5, name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 35, stock: 90, description: 'Anti-inflammatory pain relief tablet.' },
  { id: 6, name: 'ORS Sachet', category: 'Hydration', price: 20, stock: 300, description: 'Oral rehydration salts.' },
  { id: 7, name: 'Azithromycin 500mg', category: 'Antibiotic', price: 120, stock: 45, description: '3-day course antibiotic tablet.' },
  { id: 8, name: 'Pantoprazole 40mg', category: 'Antacid', price: 55, stock: 110, description: 'Acidity and reflux relief tablet.' },
  { id: 9, name: 'Cough Syrup 100ml', category: 'Cough & Cold', price: 85, stock: 70, description: 'Soothing syrup for dry cough.' },
  { id: 10, name: 'Metformin 500mg', category: 'Diabetes', price: 45, stock: 130, description: 'Blood sugar control tablet.' },
  { id: 11, name: 'Amlodipine 5mg', category: 'Cardiac', price: 60, stock: 95, description: 'Blood pressure control tablet.' },
  { id: 12, name: 'Aspirin 75mg', category: 'Cardiac', price: 30, stock: 150, description: 'Low-dose blood thinner tablet.' },
  { id: 13, name: 'Multivitamin', category: 'Supplement', price: 180, stock: 100, description: 'Daily multivitamin capsule.' },
  { id: 14, name: 'Calcium + D3', category: 'Supplement', price: 140, stock: 85, description: 'Bone health tablet.' },
  { id: 15, name: 'Loratadine 10mg', category: 'Allergy', price: 48, stock: 120, description: 'Non-drowsy antihistamine.' },
  { id: 16, name: 'Omeprazole 20mg', category: 'Antacid', price: 50, stock: 0, description: 'Reduces stomach acid.' },
  { id: 17, name: 'Diclofenac Gel', category: 'Pain Relief', price: 95, stock: 60, description: 'Topical anti-inflammatory gel.' },
  { id: 18, name: 'Cetrimide Cream', category: 'Dermatology', price: 40, stock: 75, description: 'Antiseptic skin cream.' },
  { id: 19, name: 'Salbutamol Inhaler', category: 'Respiratory', price: 210, stock: 40, description: 'Relief inhaler for asthma.' },
  { id: 20, name: 'Vitamin D3 60k', category: 'Supplement', price: 65, stock: 90, description: 'Weekly vitamin D sachet.' },
  { id: 21, name: 'Domperidone 10mg', category: 'Antacid', price: 38, stock: 105, description: 'Anti-nausea tablet.' },
  { id: 22, name: 'Betadine 100ml', category: 'Dermatology', price: 90, stock: 65, description: 'Antiseptic solution.' },
  { id: 23, name: 'Zinc + Vitamin C', category: 'Supplement', price: 120, stock: 80, description: 'Immunity chewable tablet.' },
  { id: 24, name: 'Levocetirizine 5mg', category: 'Allergy', price: 52, stock: 140, description: 'Antihistamine for allergic rhinitis.' },
];

export const orders: Order[] = [];

export const prescriptions: Prescription[] = [
  { id: 1, appointmentId: 2, patientName: 'Priya Nair', doctorName: 'Sara Verma', medicineIds: [3, 15], medicines: 'Cetirizine 10mg — 1 at night for 5 days; Loratadine 10mg — 1 in the morning', notes: 'Avoid dusty areas.', date: '2026-07-18' },
  // For the demo doctor (Aisha Khan) + patient (Vikram Rao):
  { id: 2, appointmentId: 1, patientName: 'Vikram Rao', doctorName: 'Aisha Khan', medicineIds: [1, 12], medicines: 'Paracetamol 500mg — as needed; Aspirin 75mg — 1 daily', notes: 'Follow up in 2 weeks.', date: '2026-07-20' },
];

export const invoices: Invoice[] = [
  { id: 1, patientName: 'Priya Nair', appointmentId: 2, amount: 600, status: 'paid', date: '2026-07-18' },
  { id: 2, patientName: 'Vikram Rao', appointmentId: 1, amount: 800, status: 'unpaid', date: '2026-07-20' },
];
