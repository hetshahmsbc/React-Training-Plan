// Populates doctors + patients from a public dummy API (dummyjson.com) on
// startup, so the app has realistic-looking data. If the network/proxy blocks
// the request, we keep the small built-in sample data from db.ts instead — the
// app still works fully offline.
//
// Medicines stay as our curated catalog in db.ts (there is no good free
// "medicines" API), which also keeps their ids stable so prescriptions can
// reference them.

import { doctors, patients } from './db';
import type { Doctor, Patient } from './types';

const SPECIALIZATIONS = [
  'Cardiology',
  'Orthopedics',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'General Medicine',
  'ENT',
  'Gynecology',
];

// dummyjson birthDate looks like "1996-5-30" — pad to "1996-05-30".
function normalizeDate(d?: string): string {
  if (!d) return '';
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  const [y, m, day] = parts;
  return `${y}-${m.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export async function seedFromDummyApi(): Promise<void> {
  try {
    const url =
      'https://dummyjson.com/users?limit=40&select=firstName,lastName,email,phone,gender,birthDate,bloodGroup';
    // 6s timeout so a slow/blocked network doesn't hang startup.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json: any = await res.json();
    const list: any[] = json.users ?? [];
    if (list.length === 0) throw new Error('empty user list');

    // First 12 people become doctors, the rest become patients.
    const newDoctors: Doctor[] = list.slice(0, 12).map((u, i) => ({
      id: i + 1,
      firstName: u.firstName,
      lastName: u.lastName,
      specialization: SPECIALIZATIONS[i % SPECIALIZATIONS.length],
      email: u.email,
      phone: u.phone,
      fee: 500 + (i % 6) * 100,
      available: i % 3 !== 0,
    }));

    const newPatients: Patient[] = list.slice(12).map((u, i) => ({
      id: i + 1,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      gender: u.gender === 'male' || u.gender === 'female' ? u.gender : 'other',
      dob: normalizeDate(u.birthDate),
      bloodGroup: u.bloodGroup || 'O+',
    }));

    // Replace the built-in sample data in place (arrays are shared references).
    doctors.length = 0;
    doctors.push(...newDoctors);
    patients.length = 0;
    patients.push(...newPatients);

    console.log(
      `  Seeded ${newDoctors.length} doctors + ${newPatients.length} patients from dummyjson.com`,
    );
  } catch (err) {
    console.log(
      `  Dummy API unavailable (${(err as Error).message}) — using built-in sample data.`,
    );
  }
}
