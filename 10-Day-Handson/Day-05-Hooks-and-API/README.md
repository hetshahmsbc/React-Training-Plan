# Day 5 — Hooks & API

The goal of Day 5 is to connect a React + TypeScript frontend to a **real backend
API**. Instead of data living inside the code, the app now fetches it from the
**DummyJSON** server over HTTP, and handles everything that comes with that:
loading, errors, and configuration.

Three ideas are the focus:

1. **`useEffect`** — run side effects (like fetching data) after render, re-run
   them when inputs change, and clean up correctly.
2. **Fetching data** — call an API with `fetch`, check the response, and turn it
   into typed data.
3. **Real-world states** — loading, errors, and empty results are part of the
   UI, not an afterthought.

## Folder structure

```
Day-05-Hooks-and-API/
└── products-browser/              # React + TypeScript app (Vite)
    ├── .env                        # VITE_API_BASE_URL (git-ignored)
    ├── .env.example                # safe template that IS committed
    └── src/
        ├── types.ts                # Product, ProductResponse, Category
        ├── api.ts                  # fetchProducts + fetchCategories
        ├── components/
        │   ├── SearchBar.tsx        # controlled search input
        │   ├── FilterSortBar.tsx    # category filter + sort dropdowns
        │   ├── ProductCard.tsx      # one product tile
        │   ├── ProductList.tsx      # the product grid + empty state
        │   └── Pagination.tsx       # Previous / Next + page counter
        ├── App.tsx                  # state, useEffect data fetching, layout
        ├── App.css                  # portal styling
        └── index.css                # design tokens + reset
```

## What each file teaches

| File                              | Focus                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| `types.ts`                        | Describing API data with `interface` (`Product`, `ProductResponse`, `Category`)                    |
| `api.ts`                          | `async` functions typed `Promise<T>`, building URLs with `URLSearchParams`, checking `response.ok`, reading `import.meta.env` |
| `App.tsx`                         | `useState` + `useEffect`, dependency arrays, debounce with `setTimeout`, cleanup to cancel stale requests |
| `SearchBar.tsx` / `FilterSortBar.tsx` | Controlled inputs and typed `onChange` callbacks passed through props                           |
| `ProductList.tsx` / `Pagination.tsx` | List rendering with keys, derived UI, and conditional rendering                                 |

## Environment variables

The API address is not hard-coded — it lives in `.env`:

```
VITE_API_BASE_URL=https://dummyjson.com
```

- In Vite, a variable must start with **`VITE_`** to be readable in the browser
  (`import.meta.env.VITE_API_BASE_URL`).
- `.env` is **git-ignored** (secrets never get pushed). `.env.example` is
  committed so anyone cloning the repo knows what to set.
- Restart `npm run dev` after changing `.env` — Vite reads it only at startup.

## Run the app

```powershell
cd products-browser
npm install          # first time only
npm run dev
```

Open the `http://localhost:5173/` link it prints.

## What the app does

A **Products Browser** portal that talks to DummyJSON:

- **Data fetching with `useEffect`** — products load after render and re-fetch
  whenever the page, search, category, or sort changes.
- **Pagination** — server-side via `limit` and `skip`, so each page is a fresh
  12 items and the total page count is accurate.
- **Search** — debounced (waits 400 ms after typing stops) so it doesn't fire on
  every keystroke; hits the `/products/search` endpoint.
- **Category filter & sort** — done on the server
  (`/products/category/{slug}`, `?sortBy=…&order=…`) so pagination stays correct
  across the full filtered set.
- **Loading, error & empty states** — shimmer skeleton cards while loading, a
  friendly error box if the request fails, and a "no products" message when a
  search returns nothing.

## Common mistakes to watch for

- **`fetch` doesn't throw on 404/500** — you must check `response.ok` yourself
  and throw, or a failed request slips through silently.
- **Missing `useEffect` cleanup** — without it, a fast typer can get an old
  response overwriting a newer one. The `ignore` flag + `clearTimeout` in the
  cleanup function prevents this.
- **`catch (err)` is `unknown`** — narrow it before reading `.message`:
  `err instanceof Error ? err.message : "…"`.
- **Forgetting the `VITE_` prefix** — a variable named `API_BASE_URL` (no prefix)
  is `undefined` in the browser.
- **Not resetting the page on a new search/filter** — otherwise you can be
  stranded on page 5 of a 2-page result. Reset to page 1 when the query changes.
- **Paginating/sorting on the client** — sorting only the current 12 items looks
  wrong; let the server sort and paginate the whole set.
