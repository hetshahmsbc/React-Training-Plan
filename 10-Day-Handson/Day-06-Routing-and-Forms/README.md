# Day 6 — Routing & Forms

The goal of Day 6 is to turn a single screen into a **multi-page application**.
Instead of everything living on one page, the **URL** decides what you see, and
users move around with links. You also build a **real form** with proper
**validation** so bad data never gets in.

Four ideas are the focus:

1. **React Router** — the URL controls which component (page) is shown.
2. **Nested routes** — a shared shell (navbar) stays on screen while the inner
   page changes, using `<Outlet />`.
3. **Route params** — a dynamic part of the URL like `/employees/:id` lets one
   page show any employee, read with `useParams()`.
4. **React Hook Form + validation** — collect user input, validate it, and show
   clear error messages before accepting it.

## The assignment — HR Portal

A small internal tool for an HR team:

| Route              | Page              | What it does                                    |
| ------------------ | ----------------- | ----------------------------------------------- |
| `/`                | Dashboard         | Welcome + quick stats (index route)             |
| `/employees`       | Employee List     | All employees; each links to a detail page      |
| `/employees/new`   | Add Employee      | A validated form to create a new employee       |
| `/employees/:id`   | Employee Detail   | One employee, looked up by the `:id` in the URL |
| `*`                | Not Found (404)   | Shown for any unknown URL                        |

## Folder structure

```
Day-06-Routing-and-Forms/
└── hr-portal/                     # React + TypeScript app (Vite)
    └── src/
        ├── main.tsx                # entry — wrap <App/> in <BrowserRouter>
        ├── App.tsx                 # ALL your <Routes> live here
        ├── types.ts                # Employee (and any other) types
        ├── data/
        │   └── employees.ts        # in-memory starter data
        ├── components/
        │   ├── Layout.tsx          # navbar + <Outlet/> (the shared shell)
        │   └── Navbar.tsx          # <NavLink> navigation
        ├── pages/
        │   ├── Dashboard.tsx        # "/"        (index route)
        │   ├── EmployeeList.tsx     # "/employees"
        │   ├── AddEmployee.tsx      # "/employees/new"  (React Hook Form)
        │   ├── EmployeeDetail.tsx   # "/employees/:id"  (useParams)
        │   └── NotFound.tsx         # "*" 404
        ├── index.css               # design tokens + reset (done for you)
        └── App.css                 # your own layout/page styling
```

Every file already exists with a comment explaining what to build — **you write
the code inside them.**

## What each file teaches

| File                  | Focus                                                                          |
| --------------------- | ------------------------------------------------------------------------------ |
| `main.tsx`            | Wrapping the app in `<BrowserRouter>` so routing works everywhere              |
| `App.tsx`             | `<Routes>` / `<Route>`, the `index` route, nested routes, the `*` catch-all    |
| `Layout.tsx`          | `<Outlet />` — the slot where the current child page renders                    |
| `Navbar.tsx`          | `<NavLink>` / `<Link>` for client-side navigation (no page reload)             |
| `EmployeeDetail.tsx`  | `useParams()` to read `:id` from the URL, then look up the record              |
| `AddEmployee.tsx`     | `useForm()` — `register`, `handleSubmit`, `errors`, validation rules           |
| `AddEmployee.tsx`     | `useNavigate()` to redirect back to the list after a successful submit         |

## Run the app

```powershell
cd hr-portal
npm install          # first time only
npm run dev
```

Open the `http://localhost:5173/` link it prints. As you fill in each file,
the page updates automatically.

## Suggested build order

1. `types.ts` → `data/employees.ts` (decide your data first).
2. `main.tsx` → wrap `<App/>` in `<BrowserRouter>`.
3. `App.tsx` → set up routes with `Layout` as the parent.
4. `Layout.tsx` + `Navbar.tsx` → get the shell + links working.
5. `Dashboard`, `EmployeeList`, `NotFound` → simple pages first.
6. `EmployeeDetail` → practise `useParams`.
7. `AddEmployee` → the form + validation last (the hardest part).

## Common mistakes to watch for

- **Forgetting `<BrowserRouter>`** — router hooks (`useParams`, `useNavigate`,
  `<Link>`) throw errors if the app isn't wrapped in a router. Do this in
  `main.tsx` first.
- **Using `<a href>` instead of `<Link>`** — a plain anchor does a full page
  reload and loses your app state. Always navigate with `<Link>` / `<NavLink>`.
- **Forgetting `<Outlet />`** — if your `Layout` doesn't render `<Outlet />`,
  the child pages simply never appear.
- **`useParams` values are strings** — `id` from the URL is a `string`, so
  compare carefully if your data ids are numbers.
- **Not handling a missing record** — someone can type `/employees/999`
  directly; decide what to show when no employee matches.
- **Reading the input value manually instead of `register`** — with React Hook
  Form you spread `{...register('name')}` onto the input; you don't need
  `useState` for each field.
- **Submitting invalid data** — validation lives in the `register` options
  (e.g. `{ required: true, pattern: ... }`); show `errors.field.message` next to
  each input so the user knows what's wrong.
```
