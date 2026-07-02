# React Training Plan

A 10-day, hands-on plan to learn **React + TypeScript** from the ground up.
Each day has a small, self-contained project that builds on the last — starting
with modern JavaScript fundamentals and working up to real React apps.

## Repository structure

```
React-Training-Plan/
├── package.json          # root scripts (e.g. `npm run day1`)
└── 10-Day-Handson/
    └── Day-01-Modern-JavaScript/
        ├── src/          # plain-JS logic: employees, CRUD, queries, mock API
        ├── employee-ui/  # a React (Vite) mini-app that reuses src/
        └── README.md     # details and run steps for Day 1
```

More days will be added under `10-Day-Handson/` as the plan progresses.

## Getting started

```powershell
# clone, then from the repo root:
npm install
```

## Days

| Day | Topic | What you build |
| --- | --- | --- |
| 1 | [Modern JavaScript](10-Day-Handson/Day-01-Modern-JavaScript/README.md) | An Employee system — first in the terminal, then as a React CRUD mini-app |

### Run Day 1

```powershell
# terminal version, from the repo root:
npm run day1

# React UI:
cd 10-Day-Handson/Day-01-Modern-JavaScript/employee-ui
npm install
npm run dev
```

See the [Day 1 README](10-Day-Handson/Day-01-Modern-JavaScript/README.md) for a
full breakdown of each file and the concepts it covers.

## Tech

- Node.js (ES modules)
- React 19 + Vite
- Prettier for formatting (`npm run format`)
