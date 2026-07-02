# Day 1 — Modern JavaScript

The goal of Day 1 is to get comfortable with the modern JavaScript features you
use every day in React: arrow functions, destructuring, default values, the
spread operator, array methods (`map`, `filter`, `reduce`, `find`, `sort`),
template literals, and `async`/`await` with Promises.

The example we build is a small **Employee** system. First as a terminal
program, then as a React mini-app that reuses the exact same logic.

## Folder structure

```
Day-01-Modern-JavaScript/
├── src/                  # the plain-JavaScript logic (no framework)
│   ├── employee.js       # createEmployee + describeEmployee (the "model")
│   ├── employeeStore.js  # CRUD on arrays: add / update / remove / get
│   ├── queries.js        # filtering, sorting, and totals
│   ├── api.js            # a fake async API (setTimeout + Promises)
│   └── index.js          # a terminal runner that ties it all together
└── employee-ui/          # a React app (Vite) that reuses src/ in the browser
    └── src/
        ├── lib/          # copies of the four logic files above
        └── App.jsx       # the UI: table, form, filter, sort, search
```

## What each file teaches

| File | Focus |
| --- | --- |
| `employee.js` | Destructuring, default parameters, throwing on bad input, template literals |
| `employeeStore.js` | Immutable CRUD — every change returns a **new** array (spread, `map`, `filter`) |
| `queries.js` | `filter` / `sort` / `reduce` for filtering, sorting, and totals |
| `api.js` | `async`/`await`, Promises, and simulating network delay |
| `index.js` | Putting it together and handling errors with `try`/`catch` |

## Run the terminal version

From the **repo root** (not this folder — the `day1` script path is relative to
the root):

```powershell
cd "..\..\.."        # back to "React Training Plan"
npm run day1
```

You'll see the employee list load from the fake API, then get created, updated,
removed, filtered, and saved — all printed to the console.

## Run the React mini-app

```powershell
cd employee-ui
npm install          # first time only
npm run dev
```

Open the `http://localhost:5173/` link it prints. The mini-app gives you:

- **Create / Update / Delete** employees (a shared form handles add and edit)
- A **department dropdown** for adding, and a **filter** dropdown for viewing
- **Search** by name, **sort** by salary or name, and an **active-only** toggle
- Live **stat cards**: total employees, active count, payroll, and average salary

The important idea: React only adds the *screen* and the *state*. All the real
work is still done by the same functions in `src/` — `addEmployee`,
`updateEmployee`, `removeEmployee`, `byDepartment`, `sortBySalaryDesc`, and
`totalPayroll`.

## Common mistakes to watch for

- **Missing `.js` in imports** — Node's ESM loader (`"type": "module"`) needs the
  full file name, e.g. `import { x } from "./api.js"`, not `"./api"`.
- **`{value}` vs `${value}`** in template literals — only `${ ... }` runs code;
  a bare `{ ... }` prints as plain text.
- **Case-sensitive names** — `printList` and `printlist` are different; so are
  `employee` and `employees`.
- **Mutating vs copying** — the store functions return new arrays on purpose.
  In React this matters: state must be replaced, not changed in place.
