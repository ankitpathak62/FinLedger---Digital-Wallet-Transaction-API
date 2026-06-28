# Ledger — Frontend

React + Vite dashboard for the Backend Ledger payments API.
See the [root README](../README.md) for the full-stack overview and the API reference.

## Quick start

```bash
npm install
cp .env.example .env     # set VITE_API_URL if the API isn't on localhost:3000
npm run dev              # http://localhost:5173
```

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the backend API |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |

## Architecture

- **`src/api/`** — axios instance (`client.js`) with auth-token interceptor + auto-logout on 401,
  and grouped endpoint calls (`services.js`).
- **`src/context/`** — `AuthContext` (session + login/register/logout) and `ToastContext`
  (global notifications).
- **`src/components/`** — `AppLayout` (responsive sidebar + bottom nav), `AccountCard`,
  reusable `Field`, `Spinner`, `CopyButton`, and an inline SVG `icons` set.
- **`src/pages/`** — `Login`, `Register`, `Dashboard`, `Transfer`, `NotFound`.
- **`src/styles/index.css`** — single design-token-driven stylesheet, mobile-first responsive.

## Auth model

The backend accepts the JWT either as a cookie or as an `Authorization: Bearer` header.
This app stores the token in `localStorage` and attaches it on every request, so it keeps
working even when cross-origin cookies are blocked.
