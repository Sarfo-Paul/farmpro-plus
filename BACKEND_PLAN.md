# Backend plan — FarmTrack Pro

Goal: scaffold a small TypeScript backend that exposes a REST JSON API for users, records, market prices and weather, backed by a sample database (SQLite) and easy to switch to Postgres for production.

1) Stack (recommended)
- Runtime: Node.js + TypeScript
- Framework: Fastify (lightweight, typed). Can switch to Express on request.
- ORM: Prisma
- DB (dev/sample): SQLite (file). Production: Postgres recommended.
- Auth: JWT for session tokens, `argon2` for password hashing
- Validation: Zod
- Dev tooling: `ts-node-dev`, `eslint`/`prettier` as desired

2) Architecture
- Server folder: `server/`
- API root: `/api/*`
- Auth middleware issues a JWT on login; protected endpoints require `Authorization: Bearer <token>`
- CORS configured to allow the frontend dev host (http://localhost:5173)

3) Core API (MVP)
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — returns JWT
- `GET /api/auth/me` — current user
- `GET /api/records` — list (pagination + filters)
- `POST /api/records` — create record (auth)
- `GET /api/records/:id` — read (auth/owner)
- `PUT /api/records/:id` — update (auth/owner)
- `DELETE /api/records/:id` — delete (auth/owner)
- `GET /api/market-prices` — list / query by crop/date
- `GET /api/weather` — return cached/sample weather (or proxy external API)

4) Data model (Prisma sketch)
```
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  records   Record[]
}

model Record {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  crop      String
  date      DateTime
  quantity  Float
  price     Float
  notes     String?
  location  String?
  createdAt DateTime @default(now())
}

model MarketPrice {
  id    Int      @id @default(autoincrement())
  crop  String
  date  DateTime
  price Float
}

model Weather {
  id       Int      @id @default(autoincrement())
  location String
  date     DateTime
  temp     Float?
  precip   Float?
  notes    String?
}
```

5) Sample DB & seeding
- Use `prisma` to push schema, and a simple `prisma/seed.ts` (or `prisma/seed.js`) that:
  - creates one demo user (password hashed)
  - creates ~10 `Record` rows for that user
  - creates several `MarketPrice` and `Weather` rows

6) Dev commands (example)
```
# from repository root
mkdir server && cd server
npm init -y
npm i fastify @fastify/cors @fastify/jwt prisma @prisma/client zod argon2
npm i -D typescript ts-node-dev @types/node
npx prisma init --datasource-provider sqlite
# edit prisma/schema.prisma (paste the schema above)
npx prisma db push
# create prisma/seed.ts and run
ts-node prisma/seed.ts
# start server (dev)
npm run dev
```

7) Env & security notes
- Required env variables: `DATABASE_URL`, `JWT_SECRET` (strong random string)
- Don't commit secrets — use `.env` with `.gitignore`
- Rate-limit `POST /api/auth/login` in production

8) Deliverables
- `server/` scaffold with `src/` entry `src/server.ts`
- `prisma/schema.prisma` + `prisma/seed.ts`
- Auth + Records + MarketPrices endpoints implemented
- `README` with run instructions and a simple `Dockerfile` (optional)

9) Next steps
- If this plan looks good I'll scaffold the `server/` folder (TypeScript + Fastify + Prisma), implement the Prisma schema and seed script, and expose the MVP endpoints. Tell me if you want Express/bcrypt/Postgres instead of the defaults.

Notes: this document is intentionally concise — it is the working plan I'll follow when scaffolding and implementing the backend.
