# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack wiki/knowledge base app. Three services: PostgreSQL DB, Spring Boot API server, React client.

## Development Commands

### Docker (recommended — runs all services together)

```bash
# Start all services in dev mode
docker compose up

# Start fresh with rebuilt images
docker compose up --build

# Stop services
docker compose down

# Stop and remove volumes (wipe DB)
docker compose down -v
```

### Running services locally (without Docker)

```bash
# Server (port 4000) — requires Java 17+ and Maven
cd server && mvn spring-boot:run

# Client (port 5173)
cd client && npm install && npm run dev
```

### Database migrations

Migrations are managed by **Flyway** and run automatically on application startup.
Migration SQL files live in `server/src/main/resources/db/migration/`.

### Seed test data

Seed users are inserted automatically on every startup via a Flyway repeatable migration (`R__seed.sql`) using `ON CONFLICT DO NOTHING`.

Test users: `admin@wiki.local` / `Admin1234!`, `editor@wiki.local` / `Editor1234!`, `viewer@wiki.local` / `Viewer1234!`

## Environment Setup

Copy `.env.example` to `.env`. Required variables:
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` — DB credentials
- `JWT_SECRET` — must be at least 64 chars in production
- `JWT_EXPIRES_IN` — e.g. `7d`
- `CLIENT_URL` — CORS origin(s), comma-separated (e.g. `http://localhost,http://localhost:5173`)
- `VITE_API_URL` — backend URL seen by the React app (e.g. `http://localhost:4000`)

## Architecture

### Backend (`server/`)

Spring Boot 3.3 / Java 17 / Maven project.

- `src/main/java/com/wiki/WikiApplication.java` — entry point (`@SpringBootApplication`)
- `src/main/java/com/wiki/controller/` — REST controllers; all routes under `/api/**`
- `src/main/java/com/wiki/service/` — business logic (`AuthService`, `SpaceService`, `PageService`, `CommentService`, `TagService`, `SearchService`, `UserService`, `UploadService`)
- `src/main/java/com/wiki/entity/` — JPA entities (`User`, `Space`, `Page`, `PageRevision`, `Tag`, `Comment`, `Upload`)
- `src/main/java/com/wiki/repository/` — Spring Data JPA repositories
- `src/main/java/com/wiki/security/` — `JwtTokenProvider`, `JwtAuthenticationFilter`, `SecurityConfig`, `AuthenticatedUser`
- `src/main/java/com/wiki/exception/` — `ApiException` (throw for operational errors), `GlobalExceptionHandler` (`@RestControllerAdvice`)
- `src/main/java/com/wiki/dto/` — request/response DTOs per resource
- `src/main/java/com/wiki/util/SlugUtils.java` — `slugify()` and `uniqueSlug()`
- `src/main/java/com/wiki/config/` — `WebConfig` (static upload serving), `DataInitializer`
- `src/main/resources/application.properties` — all config via env vars
- `src/main/resources/db/migration/` — Flyway SQL migrations

**Authorization levels** (numeric): viewer=1, editor=2, admin=3. Enforced by role checks in service layer using `AuthenticatedUser` from `SecurityContextHolder`.

**Build**: `mvn package -DskipTests` produces a fat JAR in `target/`.

### Database (`server/src/main/resources/db/migration/`)

- **Flyway** manages schema via versioned SQL migrations (`V1__init.sql`, …)
- PostgreSQL full-text search: `pages.search_vector` (tsvector) auto-updated by a DB trigger; queried with `plainto_tsquery`
- Pages are self-referential: `parent_id` FK; `PageService.buildTree()` converts flat list to nested tree

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
- `docker-compose.override.yml` — development overrides: mounts `./client/src` for hot reload
- Nginx (`client/nginx.conf`) proxies `/api` and `/uploads` to `wiki_server:4000` in production; Vite dev server proxies them in development (see `client/vite.config.js`)
