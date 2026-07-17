# Exercise 3 — KnockoutJS → React + TypeScript Migration

Migration of the **Jobs** screens from the Buildwatt / Northvale app (ASP.NET MVC +
KnockoutJS + jQWidgets) to a modern **React 19 + TypeScript + Vite** app.

Two screens were migrated:

1. **Jobs List** — `Views/Jobs/Index.cshtml` + `wwwroot/js/Jobs/Jobs.js`
2. **Add / Edit Job** — `Views/Jobs/AddEditJobs.cshtml` + `wwwroot/js/Jobs/JobsAddEdit.js`

---

## How to run

```bash
cd "Exercise 3 – KnockoutJS Migration Challenge"
npm install
npm run dev
```

Then open the URL Vite prints (e.g. http://localhost:5173).

Other scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (hot reload) |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run lint` | Lint with oxlint |
| `npm run preview` | Preview the production build |

> **Data:** the app ships with **bundled mock data** (`src/mock/`) matching the real
> `JobList` / `JobMaster` C# entities, and persists Add / Edit / Delete to
> **localStorage** (via `src/mock/storage.ts`) so your changes survive a page reload.
> This is entirely **local to your browser** — it never reaches the real Northvale
> backend. No .NET backend is needed to run the demo. See *Wiring to the real API*
> below to persist to the actual system. (Clear the `nv_*` localStorage keys to reset
> to the seed data.)

---

## Look & feel

The UI recreates the real Northvale / Buildwatt app — dark sidebar with the NV
branding and menu, orange accent, the exact Jobs list columns, the outlined form with
**pink read-only fields**, and the "Powered by BUILDWATT" footer — but with a cleaner,
more consistent layout. The list is seeded with the real jobs from the live screen.

## Screens & flow

```
Jobs list  ──(row / ⋮ Open)──▶  Job dashboard (tiles)  ──▶  General Details → Edit Job (form)
   │                                     └──────────────▶  Job Directory (team + grid)
   └──(+ Add New)──────────────────────────────────────▶  Add New Job (form)
```

| Screen | State |
|---|---|
| **Jobs List** | ✅ Interactive |
| **Add / Edit Job** | ✅ Interactive |
| Job Dashboard (tiles + tabs) | 🔒 Read-only (tiles navigate; tabs are static) |
| Job Directory (team + directory grid) | ✅ Interactive (assign team, add/edit/delete rows, save) |
| Sidebar nav (Dashboard, DMS, …) | 🔒 Read-only placeholders |

**Jobs List** — status filter (ALL / Live / DLP / Completed / On Hold / Submitted),
searchable + sortable table, pagination footer, row select, double-click to open, and a
"⋮" menu (Open / Delete with confirmation / Refresh / Export to CSV).

**Add / Edit Job** — all original fields grouped into sections (Job Details, Address,
Insurances & Retention, Sections Complete, Key Dates, Description) with:
- Computed fields: **Calendar Weeks** (Start + Completion), **End of DLP** and
  **Retention Due Date** (from P C Date) — same rules as the ViewModel
- LOI checkbox enables/clears the LOI value + expiry fields
- "Section complete" checkboxes enable their date + name fields
- Read-only fields shown with the app's pink tint
- Validation (Project Name, Client, Start Date, LOI rules) with inline errors
- Save returns to the list with a success banner

---

## Folder structure

```
src/
├── api/
│   ├── client.ts        # ApiResult<T> envelope + latency helper
│   └── jobsApi.ts        # getJobsList / getJob / saveJob / deleteJob
├── components/           # Reusable UI
│   ├── ConfirmDialog.tsx
│   ├── FormField.tsx     # outlined floating-label field wrapper
│   ├── icons.tsx         # inline SVG icon set
│   ├── JobsTable.tsx     # typed table: sort + search + select + pills + paging
│   ├── KebabMenu.tsx     # the "⋮" actions dropdown
│   ├── Layout.tsx        # app shell (sidebar + content + footer)
│   ├── Sidebar.tsx       # dark NV navigation
│   ├── Spinner.tsx
│   └── StatusFilter.tsx
├── hooks/
│   ├── useJobForm.ts     # form state + computed fields + validation + save
│   └── useJobsList.ts    # list load / filter / refresh
├── mock/
│   └── jobsData.ts       # seed jobs (real data), lookups, status filters
├── pages/
│   ├── JobDashboardPage.tsx  # tiles + tabs (read-only)
│   ├── JobDirectoryPage.tsx  # team + directory grid (read-only)
│   ├── JobFormPage.tsx       # Add/Edit screen
│   └── JobsListPage.tsx      # List screen
├── types/
│   └── job.ts            # JobListItem, JobFormValues, JobLookups, Option…
├── utils/
│   ├── format.ts         # currency/date/percent + diffWeeks/addYears…
│   └── jobForm.ts        # build empty form, list-row ⇆ form mapping
├── App.tsx               # routes
├── main.tsx              # entry
└── index.css             # one hand-written stylesheet (no Bootstrap/jQWidgets)
```

---

## Before → After mapping

| KnockoutJS / MVC | React + TypeScript |
|---|---|
| `ko.observable` / `ko.observableArray` | `useState` |
| `ko.pureComputed` (`isSaveButtonEnabled`) | derived values in render / `useMemo` |
| `data-bind="value: x"` | `value={x} onChange={…}` (controlled inputs) |
| `data-bind="click: fn"` | `onClick={fn}` |
| `data-bind="visible/disable"` | conditional render / `disabled` prop |
| `ko.applyBindings(vm)` | `createRoot().render(<App />)` |
| jqxGrid (30+ column config) | typed `JobsTable` component |
| `cellHighlightRenderer` | `<span>` badge + CSS class |
| jqxComboBox / jqxDropDownList | native `<select>` + `Option[]` |
| jqxDateTimeInput | native `<input type="date">` |
| Global `diff_weeks`, date juggling | `src/utils/format.ts` |
| jQuery AJAX + `Result{Error,Message,Data}` | `src/api/*` + `ApiResult<T>` |
| `window.open('Jobs/Add', '_self')` | `react-router` `navigate('/jobs/add')` |
| `Notification.success / error / warning` | toast notifications (`ToastProvider` + `useToast`) + inline field errors |
| Untyped `response.Data.JobList` | typed `JobListItem[]` |

---

## Why this is better (the "improve architecture" part)

- **Type safety** — every job field and API shape is described once in `src/types`.
  The compiler catches typos and wrong types before the app runs. The old JS had none.
- **Reusable components** — `FormField`, `JobsTable`, `Toolbar`, `ConfirmDialog`,
  `Spinner` are self-contained and reused, instead of markup copy-pasted across `.cshtml`.
- **Separation of concerns** — data (`api`/`mock`), logic (`hooks`), and view
  (`components`/`pages`) are split. The 1000-line ViewModel is now a small hook.
- **No manual DOM plumbing** — the old code called `DestroyGrid`, rebound events, and
  toggled classes by hand. React re-renders from state automatically.
- **Predictable state** — one typed state object per screen; computed fields derive from
  it, so the UI can't drift out of sync.
- **Maintainability** — folders by responsibility, one small CSS file instead of
  Bootstrap + a jQWidgets theme + custom SCSS.

---

## Wiring to the real API

The mock is isolated behind `src/api/jobsApi.ts`. To go live, replace each function body
with a real `fetch` that returns the same `ApiResult<T>` — **nothing in the components or
hooks changes**. For example:

```ts
export async function getJobsList(statusId: number): Promise<ApiResult<JobListItem[]>> {
  const res = await fetch(
    `${API_URL}/Jobs/getjobslist?isActive=true&jobid=0&operationId=10&StatusId=${statusId}&userId=${userId}`,
    { headers: { Authorization: `Bearer ${token}`, LoginId: loginId } },
  );
  const body = await res.json(); // { Error, Message, Data: { JobList, layout } }
  return { error: body.Error, message: body.Message, data: body.Data.JobList };
}
```

You'd also map the C# PascalCase fields (`JobNumber`, `ProjectName`, …) to the camelCase
names used here, in one place.
```
