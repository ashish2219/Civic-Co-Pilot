# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS
- **Session auth**: express-session (cookie-based)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── civic-copilot/      # React frontend (Civic Co-Pilot)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Application: Civic Co-Pilot

A full-stack civic grievance and scheme recommendation system.

### Features
- Complaint submission with rule-based auto-classification (category, priority, department)
- Complaint lifecycle tracking (SUBMITTED → IN_PROGRESS → RESOLVED/REJECTED)
- Personalized scheme recommendations based on complaint type and user role
- Admin dashboard with statistics and complaint management
- Session-based authentication with roles: STUDENT, CITIZEN, ADMIN

### Demo Accounts (password: admin123)
- Admin: admin@civic.gov
- Student: student@example.com
- Citizen: citizen@example.com

### Rule-Based Classifier
`artifacts/api-server/src/lib/classifier.ts` — classifies complaint text into categories (FINANCE, EDUCATION, HEALTH, INFRASTRUCTURE, HOUSING, EMPLOYMENT, ENVIRONMENT, GENERAL) and priority levels (LOW, MEDIUM, HIGH, URGENT) using keyword matching.

### Database Schema
- `users` — user accounts with roles
- `complaints` — complaints with auto-classification fields
- `status_history` — audit trail of status changes
- `schemes` — government schemes and eligibility data

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/civic-copilot` (`@workspace/civic-copilot`)

React + Vite frontend at path `/`. Uses `@workspace/api-client-react` hooks and session cookies for auth.

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes:
- `/api/auth/*` — register, login, logout, me
- `/api/complaints/*` — CRUD + status update
- `/api/schemes/*` — list + recommend
- `/api/admin/*` — admin dashboard stats and full complaint list

- `pnpm --filter @workspace/api-server run dev` — run the dev server

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `pnpm --filter @workspace/db run push` — push schema to database

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI spec + Orval codegen config.

- `pnpm --filter @workspace/api-spec run codegen` — run codegen

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.
