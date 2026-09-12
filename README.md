# Flight Logbook API

A backend API for tracking student/instructor flight training: logged
hours by category, aircraft, and currency/certification tracking.

Built as a portfolio project to demonstrate backend fundamentals: REST
API design, auth, relational data modeling, business logic, and a real
automated test suite.

## Stack

- Node.js + TypeScript + Express
- PostgreSQL + Prisma ORM
- JWT auth
- Jest + Supertest for testing

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Postgres.** Easiest options:
   - Docker: `docker run --name flight-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`
   - Or a free hosted instance: Railway, Neon, or Supabase.

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # edit .env with your DATABASE_URL and a random JWT_SECRET
   ```

4. **Create the database tables**
   ```bash
   npm run prisma:migrate
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   API is now running at `http://localhost:3000`. Try `GET /health`.

6. **Run the tests**
   ```bash
   npm test
   ```

## What's implemented

- Full `Pilot` vertical slice: register, login (JWT), get by id, list,
  and an hours-summary endpoint that aggregates logged flight time by
  category — see `src/services/pilot.service.ts`.
- Auth middleware (`src/middleware/auth.ts`) with role-based access.
- Centralized error handling (`src/middleware/errorHandler.ts`).
- One full integration test file demonstrating the testing pattern.

## What's left to build (see TODOs in each routes file)

- `src/routes/flight.routes.ts` — flight CRUD + the currency-calculation
  business logic (this is the centerpiece feature — the part worth
  spending the most time on).
- `src/routes/aircraft.routes.ts` — aircraft CRUD.
- `src/routes/certification.routes.ts` — certification tracking +
  an "expiring soon" query.
- Tests for all of the above, following `src/__tests__/pilot.test.ts`.

Build each one the same way the Pilot slice is built: a `*.service.ts`
with the database logic, a `*.controller.ts` with the HTTP/validation
logic, and a `*.routes.ts` wiring it to Express — then wire the router
into `src/app.ts`.

## API quick reference (implemented so far)

| Method | Endpoint                        | Auth required | Description               |
|--------|----------------------------------|----------------|----------------------------|
| POST   | /api/pilots/register             | no             | Create a pilot account     |
| POST   | /api/pilots/login                | no             | Get a JWT                  |
| GET    | /api/pilots                      | yes            | List all pilots            |
| GET    | /api/pilots/:id                  | yes            | Get one pilot               |
| GET    | /api/pilots/:id/hours-summary    | yes            | Logged hours by flight type |

## Deployment (once flights/aircraft are done)

- Add a `Dockerfile` + `docker-compose.yml` (API + Postgres).
- Deploy to Railway, Render, or Fly.io — all have generous free tiers.
- Point `DATABASE_URL` at the hosted Postgres instance in production env vars.
