# TaskFlow — Full-Stack Task Manager

A production-style task management app built as a skill assessment: React (Vite + Tailwind)
frontend, Node.js/Express REST API, PostgreSQL database via Prisma ORM, JWT authentication,
input validation, error handling, Swagger docs, and unit tests on both layers.

## 1. Tech stack & why

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev server, minimal config, industry-standard |
| Styling | Tailwind CSS | Consistent spacing/typography without hand-rolled CSS |
| State management | React Context API | App state is small (auth + tasks); Redux would be overkill |
| Routing | React Router | Standard for client-side route protection |
| Backend | Node.js + Express | Lightweight, explicit middleware chain, easy to reason about |
| ORM | Prisma | Type-safe queries, readable schema, auto-generated migrations |
| Database | PostgreSQL | Relational data (User → Tasks) fits a relational DB naturally |
| Auth | JWT (jsonwebtoken + bcryptjs) | Stateless auth; passwords hashed, never stored in plain text |
| Validation | express-validator (backend), manual validation (frontend) | Defense in depth: never trust client input alone |
| API docs | Swagger (swagger-jsdoc + swagger-ui-express) | Docs generated from code comments, stay in sync with routes |
| Testing | Jest + Supertest (backend), Vitest + React Testing Library (frontend) | Cover one full layer each, as required |

## 2. Project structure

```
taskflow-app/
├── backend/
│   ├── prisma/schema.prisma      # DB schema (User, Task models)
│   ├── src/
│   │   ├── config/db.js          # Prisma client singleton
│   │   ├── middleware/           # auth, validation, error handling
│   │   ├── controllers/          # business logic
│   │   ├── routes/               # route definitions + Swagger annotations
│   │   ├── docs/swagger.js       # OpenAPI config
│   │   ├── app.js                # Express app (exported for tests)
│   │   └── server.js             # starts the HTTP server
│   └── tests/                    # Jest + Supertest
├── frontend/
│   └── src/
│       ├── api/axios.js          # shared HTTP client + token interceptor
│       ├── context/AuthContext.jsx
│       ├── components/           # Button, Input, TaskCard, TaskForm, Navbar, ProtectedRoute
│       ├── pages/                # Login, Tasks
│       └── tests/                # Vitest + React Testing Library
└── postman_collection.json
```

## 3. Setup instructions

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or a connection string to a hosted instance)

### Backend

```bash
cd backend
npm install
cp .env.example .env        # fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init   # creates tables from schema.prisma
npm run dev                 # starts API on http://localhost:5000
```

- Swagger docs: http://localhost:5000/api-docs
- Health check: http://localhost:5000/health

### Frontend

```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL defaults to http://localhost:5000/api
npm run dev                 # starts app on http://localhost:5173
```

### Running tests

```bash
cd backend && npm test      # Jest + Supertest (auth & auth-guard routes)
cd frontend && npm test     # Vitest + React Testing Library (TaskForm validation)
```

### Postman
Import `postman_collection.json` into Postman. Run **Login**, copy the returned `token` into
the collection's `token` variable, then the task requests will be authenticated.

## 4. API overview

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account, returns user + JWT |
| POST | `/api/auth/login` | No | Log in, returns user + JWT |
| GET | `/api/tasks` | Yes | List the logged-in user's tasks (optional `?status=`) |
| GET | `/api/tasks/:id` | Yes | Get one task (must belong to the requester) |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Update a task |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |

Full interactive documentation (request/response shapes, try-it-out) lives in Swagger UI at
`/api-docs` once the backend is running.

## 5. Design decisions

- **Tasks are scoped per user.** Every task query filters by `userId`, and every
  update/delete first checks the existing row's `userId` matches the requester — this
  prevents User A from reading or modifying User B's tasks even by guessing IDs.
- **Passwords are bcrypt-hashed**, never stored or returned in plain text. Login/register
  responses only ever include `id`, `name`, `email`.
- **`app.js` and `server.js` are split** so tests can `require('../src/app')` and hit routes
  with Supertest without needing a real running server or open port.
- **One central error-handling middleware.** Controllers `throw`/`next()` an `AppError` with
  a status code; nothing else formats error responses, so every error looks the same to the
  client.
- **Validation happens in two places on purpose**: the frontend validates for fast feedback
  and good UX, but the backend re-validates everything with `express-validator` because the
  frontend can always be bypassed (Postman, curl, a modified client).
- **React Context over Redux**: the only global state is "who's logged in" and the task list
  is fetched per-page, so Context avoids the extra dependency and boilerplate Redux would add.

## 6. Known limitations / what I'd add with more time

- No refresh-token rotation — JWT simply expires after `JWT_EXPIRES_IN` and the user re-logs in.
- No pagination on `/api/tasks` (fine for a personal task list; would add `?page=`/`?limit=` at scale).
- No rate limiting on the auth endpoints (would add `express-rate-limit` in production).
- Test coverage focuses on the highest-risk paths (validation, auth boundary) rather than every
  endpoint, to keep the suite fast and readable within the assessment's time limit.
