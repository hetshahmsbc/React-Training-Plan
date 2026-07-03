# React Training Plan

A 10-day, hands-on plan to learn **React + TypeScript** from the ground up.
Each day has a small, self-contained project that builds on the last — starting
with modern JavaScript fundamentals and working up to real React apps.

## Repository structure

```
React-Training-Plan/
├── package.json          # root scripts (e.g. `npm run day1`)
└── 10-Day-Handson/
    ├── Day-01-Modern-JavaScript/
    │   ├── src/          # plain-JS logic: employees, CRUD, queries, mock API
    │   ├── employee-ui/  # a React (Vite) mini-app that reuses src/
    │   └── README.md     # details and run steps for Day 1
    └── Day-02-TypeScript/
        ├── src/          # the Day 1 logic converted to TypeScript
        ├── employee-ui/  # a React + TypeScript portal (validation + notifications)
        └── README.md     # details and run steps for Day 2
```

More days will be added under `10-Day-Handson/` as the plan progresses.

## Getting started

```powershell
# clone, then from the repo root:
npm install
```

## Days

| Day | Topic                                                                  | What you build                                                                                                                    |
| --- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | [Modern JavaScript](10-Day-Handson/Day-01-Modern-JavaScript/README.md) | An Employee system — first in the terminal, then as a React CRUD mini-app                                                         |
| 2   | [TypeScript](10-Day-Handson/Day-02-TypeScript/README.md)               | The same Employee system in TypeScript (reusable interfaces + a generic API response), plus a React + TS portal with validation and toast notifications |

### Run Day 1

```powershell
# terminal version, from the repo root:
npm run day1

# React UI:
cd 10-Day-Handson/Day-01-Modern-JavaScript/employee-ui
npm install
npm run dev
```

### Run Day 2

```powershell
# type-check the TypeScript logic:
cd 10-Day-Handson/Day-02-TypeScript
npx tsc

# React + TypeScript portal:
cd employee-ui
npm install
npm run dev
```

See each day's README for a full breakdown of the files and the concepts they
cover.

## Tech

- Node.js (ES modules)
- TypeScript
- React 19 + Vite
- Prettier for formatting (`npm run format`)
