// Entry point. Wires every router under /api/v1 and starts the server.
// Everything except /api/v1/auth is protected by requireAuth, which matches the
// data-layer's default of sending a Bearer token on every request.

import express from 'express';
import cors from 'cors';
import { authRouter, requireAuth } from './auth';
import { createCrudRouter } from './crudRouter';
import { pharmacyRouter } from './pharmacy';
import {
  doctors,
  patients,
  appointments,
  medicines,
  prescriptions,
  invoices,
} from './db';

const app = express();
app.use(cors());
app.use(express.json());

// Health check (open).
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'hms-backend' }));

// Auth is open (you need it to get a token in the first place).
app.use('/api/v1/auth', authRouter);

// Everything below requires a valid access token.
app.use('/api/v1', requireAuth);

app.use('/api/v1/doctors', createCrudRouter('Doctor', doctors, ['firstName', 'lastName', 'specialization', 'email'], ['email']));
app.use('/api/v1/patients', createCrudRouter('Patient', patients, ['firstName', 'lastName', 'email', 'phone', 'bloodGroup'], ['email', 'phone']));
app.use('/api/v1/appointments', createCrudRouter('Appointment', appointments, ['patientName', 'doctorName', 'reason', 'status']));
app.use('/api/v1/medicines', createCrudRouter('Medicine', medicines, ['name', 'category', 'description']));
app.use('/api/v1/prescriptions', createCrudRouter('Prescription', prescriptions, ['patientName', 'doctorName', 'medicines']));
app.use('/api/v1/invoices', createCrudRouter('Invoice', invoices, ['patientName', 'status']));

// Pharmacy (orders + checkout) — mounted at /api/v1/pharmacy.
app.use('/api/v1/pharmacy', pharmacyRouter);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`\n  HMS backend running on http://localhost:${PORT}`);
  console.log('  Demo logins:');
  console.log('    Admin   → admin@hospital.com / admin123');
  console.log('    Doctor  → aisha.khan@hospital.com / doctor123');
  console.log('    Patient → vikram.rao@example.com / patient123\n');
});
