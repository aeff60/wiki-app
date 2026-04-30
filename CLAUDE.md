# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack wiki/knowledge base app. Three services: PostgreSQL DB, Express API server, React client.

## Development Commands

### Docker (recommended — runs all services together)

```bash
# Start all services in dev mode (hot reload for both client and server)
docker compose up

# Start fresh with rebuilt images
docker compose up --build

# Run migrations
docker compose exec server npm run migrate

# Seed test data (creates admin/editor/viewer users)
docker compose exec server npm run seed

# Stop services
docker compose down

# Stop and remove volumes (wipe DB)
docker compose down -v
```

### Running services locally (without Docker)

```bash
# Server (port 4000)
cd server && npm install && npm run dev

# Client (port 5173)
cd client && npm install && npm run dev
```

### Database migrations

```bash
cd server
npm run migrate           # Run pending migrations
npm run migrate:rollback  # Roll back last batch
```

## Environment Setup

Copy `.env.example` to `.env`. Required variables:
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` — DB credentials
- `JWT_SECRET` — must be at least 64 chars in production
- `JWT_EXPIRES_IN` — e.g. `7d`
- `CLIENT_URL` — CORS origin(s), comma-separated (e.g. `http://localhost,http://localhost:5173`)
- `VITE_API_URL` — backend URL seen by the React app (e.g. `http://localhost:4000`)

Test users after seeding: `admin@wiki.local` / `Admin1234!`, `editor@wiki.local` / `Editor1234!`, `viewer@wiki.local` / `Viewer1234!`

## Architecture

### Backend (`server/`)

- `src/server.js` — entry point, starts Express on `PORT` (default 4000)
- `src/app.js` — registers middleware (Helmet, CORS, Morgan, body parser) and mounts all routes under `/api`
- `src/routes/index.js` — top-level router; sub-routers: `auth`, `spaces`, pages (nested under spaces), `tags`, `search`, `users`, `uploads`
- `src/controllers/` — thin handlers that call services
- `src/services/` — business logic; `pages.service.js` handles tree building, revision snapshots, tag upserts
- `src/middleware/` — `authenticate.js` (JWT → `req.user`), `authorize.js` (role check), `validateBody.js` (Zod schema), `errorHandler.js`
- `src/utils/ApiError.js` — throw `new ApiError(statusCode, message)` for operational errors; `errorHandler` returns these as-is, logs and hides non-operational errors

All backend code uses **ES Modules** (`"type": "module"` in package.json).

**Authorization levels** (numeric): viewer=1, editor=2, admin=3. Use `authorize('editor')` or `authorize('admin')` middleware.

**Validation**: use Zod schemas passed to `validateBody(schema)` middleware. Define schemas alongside routes or in a dedicated `schemas/` file.

### Database (`server/db/`)

- **Knex** for query building and migrations; config in `knexfile.js`
- Migrations in `db/migrations/` (timestamp-prefixed filenames)
- PostgreSQL full-text search: `pages.search_vector` (tsvector) is auto-updated by a DB trigger; query with `tsquery`
- Pages are self-referential: `parent_id` FK to `pages.id` for hierarchy; `pages.service.js:buildTree()` converts flat rows to nested tree

### Frontend (`client/`)

- `src/App.jsx` — React Router v6 route tree; public routes (`/login`, `/register`) vs. routes inside `AppShell` (requires auth)
- `src/components/layout/AppShell.jsx` — auth guard, renders TopBar + Sidebar + `<Outlet>`
- `src/api/axios.js` — shared Axios instance; request interceptor injects `Authorization: Bearer <token>`; response interceptor clears auth on 401
- `src/api/*.js` — one module per resource (auth, spaces, pages, comments, search, tags, users, uploads)
- `src/store/authStore.js` — Zustand store for `user` and `token`, persisted to `localStorage` as `wiki-auth`
- `src/store/uiStore.js` — sidebar open/close, persisted to localStorage
- `src/components/auth/ProtectedRoute.jsx` — wraps routes needing a minimum role (`minRole` prop: `'editor'` or `'admin'`)

**Markdown**: `MarkdownEditor.jsx` wraps `@uiw/react-md-editor`; `MarkdownRenderer.jsx` renders with `react-markdown` + `highlight.js` syntax highlighting.

**Styling**: Tailwind CSS. Custom prose `mark` style (yellow highlight) defined in `src/index.css`.

### Docker Compose

- `docker-compose.yml` — production build targets
- `docker-compose.override.yml` — development overrides: mounts local `./server/src` and `./client/src` for hot reload, runs `npm run dev` in each container
- Nginx (`client/nginx.conf`) proxies `/api` and `/uploads` to `wiki_server:4000` in production; Vite dev server proxies them in development (see `client/vite.config.js`)
