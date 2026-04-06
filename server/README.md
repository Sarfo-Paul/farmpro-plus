# FarmTrack Pro — Server

This folder contains the TypeScript Fastify backend (Prisma + SQLite by default) used by the FarmTrack Pro demo app.

Quick start — development

1. Install and seed the database, then run the server in dev mode:

```powershell
cd server
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

2. Start the frontend dev server from the workspace root (optional during development):

```powershell
# from repo root
npm install
npm run dev
```

Build & run (production-like)

1. Build the frontend and server, then start the compiled server. The server will serve the frontend automatically when it finds a `dist/` folder one level up from the `server/` folder.

```powershell
# from repo root
npm run build

cd server
npm run build
npm run start
# visit http://localhost:4000
```

Environment variables

Create a `.env` in `server/` (or set env vars in your environment). Important vars:

- `DATABASE_URL` — e.g. `file:./dev.db` (Prisma). For production use a managed DB.
- `JWT_SECRET` — set a secure secret (defaults to `dev-secret` in development).
- `PORT` — server port (defaults to `4000`).
- `ADMIN_EMAILS` — comma-separated list of emails to treat as admins (defaults to `alice@example.com`).

Seeding & demo accounts

Run the seeder to populate demo users, records, market prices, and weather samples:

```powershell
cd server
npm run seed
```

Seeder-created demo accounts (passwords are `Password123!`):

- alice@example.com
- bob@example.com
- carla@example.com
- dan@example.com
- ella@example.com
- frank@example.com

API overview

- `GET /api` — API root and quick status
- `POST /api/auth/login` — login; body `{ email, password }` => returns `{ token, user }`
- `POST /api/auth/register` — create account
- `GET /api/auth/me` — authenticated; returns current user (includes `isAdmin`)
- `PUT /api/auth/me` — update name/password (authenticated)
- `GET /api/records` — list records (query: `userId`, `limit`, `crop`). If authenticated and no `userId` provided, returns the authenticated user's records.
- `POST /api/records` — create a record (authenticated)
- `GET /api/market-prices` — list market prices
- `GET /api/weather` — list weather samples

Admin API

Admin endpoints require authentication and the user email must be listed in `ADMIN_EMAILS`:

- `GET /api/admin/users` — list users
- `DELETE /api/admin/users/:id` — delete user
- `GET /api/admin/market-prices` — list market prices
- `POST /api/admin/market-prices` — create price (body: `{ crop, price, date? }`)
- `DELETE /api/admin/market-prices/:id` — delete price

Testing

- Smoke tests (auth, records, market):

```powershell
cd server
npm run test:smoke
```

- Admin smoke test (logs in as seeded admin and fetches users):

```powershell
cd server
npx ts-node test/admin.ts
```

Notes & recommendations

- The server will serve a built frontend when a `dist/` folder exists at `../dist` relative to `server/` (this mirrors the workspace layout where the client build output lives next to `server/`).
- For production, use a managed database (Postgres, MySQL), set a strong `JWT_SECRET`, and run behind HTTPS.
- Admin control is intentionally simple here (email-based via `ADMIN_EMAILS`) to avoid DB migrations in this demo — switch to role-based permissioning for production.

If you want, I can:

- Create a dedicated production Dockerfile/docker-compose for deployment.
- Harden auth and add role-based permissions in the database.

