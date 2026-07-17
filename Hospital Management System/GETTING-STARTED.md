# Hospital Management System

A small full-stack app that follows a patient's journey from **booking an
appointment** all the way to **buying medicine** — built to practise the
internal `@msbc` React toolkit.

```
Login → Appointments → Doctors → Patients → Prescriptions → Billing → Pharmacy (buy medicine)
```

- **frontend/** — React + Vite app using `@msbc/config-ui`, `@msbc/data-layer`, `@msbc/react-toolkit`
- **backend/** — Node + Express + TypeScript mock REST API (JWT auth, pagination, search, sort, filter)

The `README.md` and `ReactToolkit-Architecture.pdf` next to this file are the
**reference docs** for the toolkit — keep them for reading.

---

## How the two halves connect

The `@msbc/data-layer` axios instance sends requests to **relative** URLs like
`/api/v1/doctors`. Vite's dev server proxies anything starting with `/api` to
the backend on port **4000** (see [frontend/vite.config.ts](frontend/vite.config.ts)),
so you never hard-code a base URL and there are no CORS problems.

```
Browser → Vite dev server (5173) → /api/* proxied → Express backend (4000)
```

---

## Where the data comes from (dummy data)

On startup the backend tries to seed **doctors** and **patients** from the public
dummy API **https://dummyjson.com/users** (see [backend/src/seed.ts](backend/src/seed.ts)):

- First 12 people → doctors (a specialization, fee and availability are added).
- The rest → patients (gender, date of birth, blood group come straight from the API).

If that request is blocked (corporate proxy / offline), it logs
`Dummy API unavailable — using built-in sample data` and falls back to the
built-in set in [backend/src/db.ts](backend/src/db.ts) (10 doctors + 12 patients),
so the app always has data either way.

**Medicines** are a curated catalog of 24 items in `db.ts` (there is no good free
"medicines" API, and fixed ids let prescriptions reference them reliably).

> Data lives in memory and resets on every backend restart.

## The prescription → pharmacy flow

This is the full journey the app demonstrates:

1. **Book** an appointment (patient + doctor).
2. The doctor writes a **Prescription** and ticks the actual medicines from the
   catalog (stored as `medicineIds`).
3. On the Prescriptions screen, click **Buy** on that row.
4. You land on **Pharmacy** with those medicines **already in the cart** and the
   patient name filled in — review quantities and **Place Order**.
5. The backend checks stock, reduces it, and records the order.

---

## Prerequisites

1. **Node.js 18+** and npm.
2. **Access to the MSBC Nexus registry** for the `@msbc/*` packages. The
   frontend already has an [.npmrc](frontend/.npmrc) pointing the `@msbc` scope
   at Nexus:
   ```
   @msbc:registry=https://nexus.msbcgroup.com/repository/msbc-npm-registry/
   ```
   You must be on the **company network / VPN**, and if Nexus needs a login you
   need an auth token in your user `~/.npmrc` (ask your team lead), e.g.:
   ```
   //nexus.msbcgroup.com/repository/msbc-npm-registry/:_authToken=YOUR_TOKEN
   ```
   Without this, `npm install` in the frontend cannot download the `@msbc`
   packages. The backend uses only public packages, so it always installs.

---

## Run it — commands

Open **two terminals**.

### 1) Backend (terminal 1)

```bash
cd "Hospital Management System/backend"
npm install
npm run dev
```

You should see:

```
HMS backend running on http://localhost:4000
Login with  admin@hospital.com / admin123
```

### 2) Frontend (terminal 2)

```bash
cd "Hospital Management System/frontend"
npm install
npm run dev
```

Open the URL Vite prints (**http://localhost:5173**) and log in:

| Email                | Password   |
| -------------------- | ---------- |
| `admin@hospital.com` | `admin123` |

> Start the backend **first** so the frontend's `/api` calls have something to
> reach.

---

## What each screen shows (and which toolkit piece it uses)

| Screen            | Toolkit pieces used                                                        |
| ----------------- | -------------------------------------------------------------------------- |
| **Login**         | `useApiRequest` (data-layer) with `authRequired: false`                    |
| **Appointments**  | `ConfigurableDashboard` + `Modal` + `ConfigurableForm` (doctor/patient dropdowns from the API) |
| **Doctors**       | `ConfigurableDashboard` + `ConfigurableForm` in a `Modal`                  |
| **Patients**      | same CRUD pattern                                                          |
| **Prescriptions** | same CRUD pattern                                                          |
| **Billing**       | `ConfigurableDashboard` of invoices + create/edit modal                    |
| **Pharmacy**      | `useApiRequest` + `Button` — custom catalog, cart and checkout (POST order → stock reduces) |

The **CRUD pattern** (used by 5 screens) is exactly the README's
UserManagement example: a `ConfigurableDashboard` fetches and paginates the list
internally, "Add"/"Edit" opens a `ConfigurableForm` inside a `Modal`, and on
save the page calls `dashboardRef.current.handleRefresh(true)` to reload.

---

## Project structure

```
Hospital Management System/
├─ GETTING-STARTED.md        ← you are here
├─ README.md                 ← toolkit reference (do not edit)
├─ ReactToolkit-Architecture.pdf
├─ backend/
│  └─ src/
│     ├─ server.ts           mounts every route under /api/v1
│     ├─ auth.ts             login / refresh / requireAuth middleware
│     ├─ db.ts               in-memory seed data
│     ├─ store.ts            pagination / search / sort / filter
│     ├─ crudRouter.ts       generic REST resource
│     ├─ pharmacy.ts         orders + checkout (reduces stock)
│     └─ types.ts
└─ frontend/
   └─ src/
      ├─ main.tsx            imports toolkit CSS, mounts App
      ├─ App.tsx             auth gate + react-router routes
      ├─ context/AuthContext.tsx
      ├─ lib/dataLayer.ts    token manager bridge (setTokens, refresh endpoint)
      ├─ services/useCrud.ts create/update/delete via useApiRequest
      ├─ utils/constants.ts  all API endpoints
      ├─ components/         Layout + the modals
      └─ pages/              one file per screen
```

---

## Backend API (quick reference)

All routes below `/api/v1/auth` require `Authorization: Bearer <token>`.

| Method | Path                        | Purpose                          |
| ------ | --------------------------- | -------------------------------- |
| POST   | `/api/v1/auth/login`        | `{ email, password }` → tokens   |
| POST   | `/api/v1/auth/refresh`      | `{ refreshToken }` → accessToken |
| GET    | `/api/v1/doctors`           | list (`?search=&page=&pageSize=&sortField=&sortDir=`) |
| POST   | `/api/v1/doctors`           | create                           |
| PUT    | `/api/v1/doctors/:id`       | update                           |
| DELETE | `/api/v1/doctors/:id`       | delete                           |
| …      | patients / appointments / medicines / prescriptions / invoices | same shape |
| GET    | `/api/v1/pharmacy/orders`   | list orders                      |
| POST   | `/api/v1/pharmacy/orders`   | `{ patientName, items:[{medicineId, qty}] }` — checkout |

List responses look like:

```json
{ "data": [ ... ], "currentPage": 1, "totalRecords": 42, "totalPage": 5 }
```

> Data lives in memory and **resets when the backend restarts**.

---

## Troubleshooting / things you may need to tweak

These are the spots where the app depends on exact `@msbc` package details that
can differ slightly between versions. Each is isolated so a fix is one line.

1. **`npm install` fails on `@msbc/*`** → you're not on the VPN or missing the
   Nexus auth token (see Prerequisites).

2. **Peer-dependency (ERESOLVE) error about React version** → this app uses
   **React 19** because `@msbc/config-ui` requires `react@^19.1.1`. If a future
   toolkit version needs a different React, bump `react`, `react-dom`,
   `@types/react`, `@types/react-dom` in
   [frontend/package.json](frontend/package.json) to match — don't paper over it
   with `--legacy-peer-deps`.

3. **Logged in but every request returns 401** → the token isn't being stored
   in the shape the interceptor reads. Open
   [frontend/src/lib/dataLayer.ts](frontend/src/lib/dataLayer.ts) and switch the
   `setTokens` call to the positional form
   `dl.setTokens(accessToken, refreshToken)` (hover the function in your editor
   to see the real signature).

4. **A form field renders oddly** (e.g. the multi-line `textarea`) → field
   schemas follow the README example (`type: 'input'`, `variant: '…'`). If your
   `config-ui` version expects a different shape, adjust the `fields` array in
   the relevant modal under `frontend/src/components/`.

5. **Toolkit components look unstyled / transparent (modal, forms)** → the
   toolkit's shipped CSS *references* design tokens (`--color-primary-07`,
   `--space-100`, `--font-body-sm`, …) but does not define them. We define all of
   them in [frontend/src/styles/tokens.css](frontend/src/styles/tokens.css),
   imported in [main.tsx](frontend/src/main.tsx) right after the toolkit CSS.
   Re-theme the whole app (and the AG-Grid table) by editing those values.

6. **A dashboard table shows no rows even though the API returns data** → the
   AG-Grid table needs a height. `ConfigurableDashboard` sets
   `domLayout: "normal"` internally, so we override it back to
   `domLayout: 'autoHeight'` in each page's `tableProps` (it sizes to its rows).

7. **Editor shows a red mark on `backend/tsconfig.json`** → VS Code may use its
   own bundled (older) TypeScript that rejects newer options. The build itself is
   clean (`npx tsc` passes). Tip: Command Palette → "TypeScript: Select TypeScript
   Version" → "Use Workspace Version" so the editor matches the build.

6. **The medicine picker (checkbox group) in the Prescription form doesn't
   return an array** → the `type: 'checkbox'` field in
   [frontend/src/components/PrescriptionModal.tsx](frontend/src/components/PrescriptionModal.tsx)
   assumes `config-ui`'s CheckboxGroup gives back an array of selected values.
   If your version differs, adjust `handleSubmit` there (the "Buy at Pharmacy"
   flow just needs a `medicineIds` number array on the prescription).
