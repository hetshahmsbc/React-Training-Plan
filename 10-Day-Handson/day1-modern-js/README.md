# Day 1 — Modern JavaScript (ES6+) Hands-on

A small Employee management program that practises every Day-1 concept.

## How to run

From the **project root** (the `React Training Plan` folder):

```bash
npm run day1
```

Or run the file directly:

```bash
node 10-Day-Handson/day1-modern-js/src/index.js
```

## What each file does

| File | Assignment part | Concepts practised |
|------|-----------------|--------------------|
| `src/employee.js` | Employee model | destructuring, default values, template literals |
| `src/employeeStore.js` | CRUD using arrays | spread `...`, `map`, `filter`, `find`, immutability |
| `src/queries.js` | Filtering & Sorting | `filter`, `sort` (copy first!), `reduce` |
| `src/api.js` | Mock async API | Promises, `setTimeout`, `async`/`await` |
| `src/index.js` | Runs everything | `async`/`await`, `try`/`catch`, ES modules |

## The one habit to build

**Never change an array in place — always return a new copy.**
`addEmployee`, `updateEmployee`, and `removeEmployee` all return a brand-new
array. This is exactly how React later detects that something changed.

## Try it yourself (extra practice)

Once the demo runs, try extending it:

1. Add a `sortBySalaryAsc` (lowest first) in `queries.js`.
2. Add a `byActiveStatus(employees, isActive)` filter.
3. In `index.js`, print the total payroll of the **Sales** department only
   (hint: combine `byDepartment` + `totalPayroll`).
4. Add a `giveRaise(employees, id, percent)` to `employeeStore.js` that
   increases one employee's salary by a percentage — without mutating.
