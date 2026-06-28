# Notes App Frontend

A Next.js frontend for a workspace-based notes application. The UI includes authentication, workspace management, and note editing.

## Overview

The frontend is built with Next.js App Router, TypeScript, Tailwind CSS, React Query, and Zustand. It communicates with the backend API using Axios and handles access token refresh automatically.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 |
| UI | React 18, Tailwind CSS |
| Data | React Query, Axios |
| State | Zustand |
| Forms | React Hook Form, Zod |
| Tooling | TypeScript, ESLint |

## Key features

- login and registration views
- authenticated dashboard routes
- workspace list and workspace detail pages
- note list and editor experience
- global auth state with Zustand
- Axios interceptors for bearer tokens and refresh handling
- protected routes using `middleware.ts`

## Frontend structure

- `src/app/` — pages and layouts
- `src/components/` — UI and dashboard components
- `src/hooks/` — data and auth hooks using React Query
- `src/lib/api/` — Axios client and endpoint definitions
- `src/lib/auth/` — auth service and storage helpers
- `src/stores/` — Zustand stores for auth and notifications
- `src/types/` — shared TypeScript models
- `src/middleware.ts` — route protection

## Environment

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Available scripts

- `npm run dev` — Start development server
- `npm run build` — Build production app
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npm run type-check` — Run TypeScript checks

## API integration

The frontend calls these backend endpoints:

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### Workspaces
- `GET /api/workspaces`
- `POST /api/workspace`
- `GET /api/workspace/:id`
- `PUT /api/workspace/:id`
- `DELETE /api/workspace/:id`

### Notes
- `GET /api/notes?workspace_id=:id`
- `POST /api/notes`
- `GET /api/notes/:id`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

## Dependencies

- `next`
- `react`
- `react-dom`
- `typescript`
- `tailwindcss`
- `@tanstack/react-query`
- `axios`
- `react-hook-form`
- `zod`
- `zustand`
- `lucide-react`
- `clsx`
- `tailwind-merge`
