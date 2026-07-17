// All REST endpoints in one place. Paths are relative ("/api/...") because the
// data-layer axios instance has no baseURL — Vite's dev proxy forwards /api to
// the Express backend (see vite.config.ts).

export const ApiUrls = {
  auth: {
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
  },
  doctors: {
    list: '/api/v1/doctors',
    create: '/api/v1/doctors',
    update: (id: string | number) => `/api/v1/doctors/${id}`,
    remove: (id: string | number) => `/api/v1/doctors/${id}`,
  },
  patients: {
    list: '/api/v1/patients',
    create: '/api/v1/patients',
    update: (id: string | number) => `/api/v1/patients/${id}`,
    remove: (id: string | number) => `/api/v1/patients/${id}`,
  },
  appointments: {
    list: '/api/v1/appointments',
    create: '/api/v1/appointments',
    update: (id: string | number) => `/api/v1/appointments/${id}`,
    remove: (id: string | number) => `/api/v1/appointments/${id}`,
  },
  medicines: {
    list: '/api/v1/medicines',
    create: '/api/v1/medicines',
    update: (id: string | number) => `/api/v1/medicines/${id}`,
  },
  prescriptions: {
    list: '/api/v1/prescriptions',
    create: '/api/v1/prescriptions',
    update: (id: string | number) => `/api/v1/prescriptions/${id}`,
    remove: (id: string | number) => `/api/v1/prescriptions/${id}`,
  },
  invoices: {
    list: '/api/v1/invoices',
    create: '/api/v1/invoices',
    update: (id: string | number) => `/api/v1/invoices/${id}`,
  },
  pharmacy: {
    orders: '/api/v1/pharmacy/orders',
    checkout: '/api/v1/pharmacy/orders',
  },
};
