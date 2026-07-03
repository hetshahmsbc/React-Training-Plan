# Day 2 — TypeScript

The goal of Day 2 is to take the Day 1 Employee system and convert it to
**TypeScript**: describe your data with reusable **interfaces**, and wrap API
results in a single **generic** type. Then reuse that exact logic in a polished
React + TypeScript portal.

Three ideas are the focus:

1. **Convert to TypeScript** — add types so mistakes are caught before you run.
2. **Reusable interfaces** — describe an `Employee` once, reuse it everywhere.
3. **Generic API response** — one `ApiResponse<T>` that can carry any payload.

## Folder structure

```
Day-02-TypeScript/
├── src/                   # the TypeScript logic (the assignment)
│   ├── types.ts           # Employee, NewEmployee, and the generic ApiResponse<T>
│   ├── employee.ts        # createEmployee + describeEmployee (the "model")
│   ├── employeeStore.ts   # CRUD on arrays: add / update / delete / get
│   ├── queries.ts         # filtering, sorting, and totals
│   ├── api.ts             # a fake async API returning ApiResponse<T>
│   └── index.ts           # (optional) a terminal runner
├── tsconfig.json          # TypeScript settings (strict mode on)
└── employee-ui/           # a React + TypeScript app that reuses the logic
    └── src/
        ├── lib/           # copies of the logic files above
        └── App.tsx        # the UI: table, form, validation, notifications
```

## What each file teaches

| File               | Focus                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| `types.ts`         | `interface`, `Omit` + optional fields, and a **generic** `ApiResponse<T>` |
| `employee.ts`      | Typed function arguments and return types; deriving one type from another |
| `employeeStore.ts` | `Employee[]`, `Employee \| undefined`, and `Partial<Employee>`            |
| `queries.ts`       | Typing `filter` / `sort` / `reduce` helpers                               |
| `api.ts`           | `async` functions typed as `Promise<ApiResponse<T>>`                      |

## Run the type-check

From this folder:

```powershell
npx tsc
```

No output means no type errors — TypeScript is happy.

## Run the React + TypeScript portal

```powershell
cd employee-ui
npm install          # first time only
npm run dev
```

Open the `http://localhost:5173/` link it prints. On top of the Day 1 features
(create / update / delete, department filter, search, sort, active toggle, and
live stat cards), the Day 2 portal adds:

- **Inline form validation** — name and salary are checked with red highlights
  and clear messages; submit is blocked until everything is valid.
- **Toast notifications** — every add / update / delete pops a colored message
  that auto-dismisses. Saving runs through your async `SaveEmployee` and shows
  the `message` from your generic `ApiResponse`.
- A **"Saving…"** loading state while the async save is in flight.

As in Day 1, React only adds the _screen_ and the _state_. All the real work is
still done by the same typed functions in `lib/` — `addEmployee`,
`updateEmployee`, `deleteEmployee`, `SaveEmployee`, `byDepartment`,
`sortBySalaryDesc`, and `totalPayroll`.

## Common mistakes to watch for

- **`catch (err)` is `unknown`** — you can't read `err.message` directly; narrow
  it first: `err instanceof Error ? err.message : String(err)`.
- **`find` can return `undefined`** — `getEmployee` is typed `Employee | undefined`,
  so check it before use (`if (emp) { ... }`).
- **`colSpan="5"` vs `colSpan={5}`** — in TSX, numeric props take a number in
  braces, not a string.
- **Forgetting `.data`** — `fetchEmployees()` returns `ApiResponse<Employee[]>`,
  so read `res.data` to get the actual list.
- **Two copies of the logic** — `src/` is the assignment; `employee-ui/src/lib/`
  is the copy the UI imports. Change one and you must update the other.
