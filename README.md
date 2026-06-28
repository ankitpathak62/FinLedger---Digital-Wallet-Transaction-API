project # 💸 Ledger — Double-Entry Payments App

A full-stack money-movement application built around an **immutable, double-entry ledger**.
Open accounts, hold balances that are *derived* from ledger entries (never stored directly),
and make safe, idempotent transfers between accounts.

| Layer | Stack |
| --- | --- |
| **Backend** | Node.js · Express 5 · MongoDB (Mongoose) · JWT auth · Nodemailer |
| **Frontend** | React 18 · Vite · React Router · Axios |

---

## 📂 Project structure

```
backend-ledger-main/
├── Backend/                 # Express REST API
│   ├── server.js            # Entry point (port 3000)
│   └── src/
│       ├── app.js           # Express app + CORS + routes
│       ├── config/db.js     # MongoDB connection
│       ├── controllers/     # auth · account · transaction logic
│       ├── middleware/       # JWT auth guard
│       ├── models/          # user · account · transaction · ledger · blacklist
│       ├── routes/          # /api/auth · /api/accounts · /api/transactions
│       └── services/        # email notifications
│
├── Frontend/                # React dashboard (Vite)
│   └── src/
│       ├── api/             # axios client + service calls
│       ├── context/         # Auth & Toast providers
│       ├── components/      # Layout, cards, form fields, icons…
│       ├── pages/           # Login · Register · Dashboard · Transfer
│       └── styles/          # Global responsive stylesheet
│
└── README.md                # You are here
```

---

## 🧠 How the ledger works

This is **not** a simple "balance field" wallet. Every movement of money is recorded as two
immutable ledger entries:

- A **DEBIT** entry on the sender's account
- A **CREDIT** entry on the receiver's account

An account's balance is **computed on demand** by aggregating its ledger entries
(`totalCredit − totalDebit`). Ledger rows can never be updated or deleted — Mongoose
middleware actively blocks it. This is the same model real banks and accounting systems use,
and it makes the system auditable and tamper-evident.

Transfers are **idempotent**: every transfer carries an `idempotencyKey`, so a retried request
(e.g. after a flaky network) will never double-charge.

> ⏱️ **Note:** the backend's transfer endpoint includes a deliberate ~15-second delay to
> simulate settlement inside a MongoDB transaction. The frontend handles this gracefully with a
> clear "Processing…" state — this is expected behaviour, not a bug.

---

## 🚀 Getting started

### Prerequisites
- **Node.js** 18+ (tested on 22)
- **MongoDB** — a connection string (local `mongod` or MongoDB Atlas).
  Transactions require a **replica set** (Atlas works out of the box; a standalone local
  `mongod` does not support multi-document transactions).

### 1️⃣ Backend

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/ledger
JWT_SECRET=replace-with-a-long-random-string
FRONTEND_URL=http://localhost:5173

# Email (optional — Gmail OAuth2). Leave blank to skip emails.
EMAIL_USER=
CLIENT_ID=
CLIENT_SECRET=
REFRESH_TOKEN=
```

Run it:

```bash
npm run dev      # nodemon (auto-reload)
# or
npm start        # plain node
```

API is now live at **http://localhost:3000**.

### 2️⃣ Frontend

```bash
cd Frontend
npm install
cp .env.example .env      # then edit if your API isn't on localhost:3000
npm run dev
```

App is now live at **http://localhost:5173**.

---

## 🔌 API reference

Base URL: `http://localhost:3000`
Auth: send the JWT as `Authorization: Bearer <token>` (also set as a cookie on login/register).

### Auth — `/api/auth`
| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/register` | `{ name, email, password }` | Create account, returns `{ user, token }` |
| `POST` | `/login` | `{ email, password }` | Returns `{ user, token }` |
| `POST` | `/logout` | – | Blacklists the current token |

### Accounts — `/api/accounts` 🔒
| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/` | Open a new account for the logged-in user |
| `GET` | `/` | List the user's accounts |
| `GET` | `/balance/:accountId` | Get an account's derived balance |

### Transactions — `/api/transactions` 🔒
| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/` | `{ fromAccount, toAccount, amount, idempotencyKey }` | Transfer money |

🔒 = requires authentication.

---

## 🖥️ Frontend features

- **Auth flow** — polished split-screen login & register with inline validation
- **Dashboard** — total balance summary + a card per account with live, refreshable balances
- **One-tap account creation**
- **Transfer page** — source-account picker (with balances), live preview, idempotent submission,
  and a clear long-running "Processing…" state for the ~15s settlement
- **Toasts** for every success/error
- **Fully responsive** — desktop sidebar collapses into a mobile top-bar + bottom tab nav;
  layouts reflow down to phone widths
- **Session persistence** via `localStorage`, with auto-logout on `401`

---

## 🛠️ Scripts

**Backend**
```bash
npm run dev      # nodemon
npm start        # node server.js
```

**Frontend**
```bash
npm run dev      # Vite dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

---

## 📝 Notes & tips

- If transfers fail with a *"Transaction numbers are only allowed on a replica set"* error,
  your MongoDB isn't a replica set — use **MongoDB Atlas** or start local `mongod` with
  `--replSet`.
- To send money between two users, open an account in each, copy the **destination account ID**
  (copy button on each account card) and paste it into the Transfer page.
- Initial funds: the backend exposes a system-only endpoint
  (`POST /api/transactions/system/initial-funds`) used to seed balances. It requires a user
  flagged `systemUser: true` in the database.
```

---

Built with ❤️ using React + Express.
