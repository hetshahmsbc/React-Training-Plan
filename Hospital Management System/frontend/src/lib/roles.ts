// Which nav items each role sees, and what each role may do per resource.

import type { Role, AuthUser } from '../context/AuthContext';

export const NAV_BY_ROLE: Record<Role, string[]> = {
  admin: ['/dashboard', '/appointments', '/doctors', '/patients', '/pharmacy', '/prescriptions', '/billing', '/meet'],
  doctor: ['/dashboard', '/appointments', '/patients', '/prescriptions', '/meet'],
  patient: ['/dashboard', '/appointments', '/prescriptions', '/pharmacy', '/billing', '/meet'],
};

type Action = 'add' | 'edit' | 'delete';

// Admin can do everything. Others get an explicit allow-list per resource.
const CAPS: Record<Role, Record<string, Action[]>> = {
  admin: {},
  doctor: {
    appointments: ['edit'], // reschedule / mark complete
    prescriptions: ['add', 'edit', 'delete'],
  },
  patient: {
    appointments: ['add', 'edit', 'delete'], // book / reschedule / cancel
  },
};

export function can(role: Role | undefined, resource: string, action: Action): boolean {
  if (!role) return false;
  if (role === 'admin') return true;
  return (CAPS[role]?.[resource] ?? []).includes(action);
}

/** Filter rows to the signed-in doctor/patient (admin sees all). If the resource
 *  has no field for this role, it isn't theirs → return nothing. */
export function scopeByRole<T extends Record<string, any>>(
  rows: T[],
  user: AuthUser | null,
  opts: { doctorField?: string; patientField?: string },
): T[] {
  if (!user || user.role === 'admin') return rows;
  const field = user.role === 'doctor' ? opts.doctorField : opts.patientField;
  if (!field) return [];
  return rows.filter((r) => r[field] === user.name);
}
