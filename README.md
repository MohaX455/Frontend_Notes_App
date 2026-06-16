# Notes App Frontend

A modern Notes application built with Next.js 14+, TypeScript, Tailwind CSS, and powered by React Query and Zustand.

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route group — pages publiques
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/            # Route group — pages protégées
│   │   ├── layout.tsx
│   │   ├── workspaces/
│   │   │   └── page.tsx
│   │   └── workspaces/[id]/
│   │       └── page.tsx
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Redirect vers /workspaces ou /login
│
├── components/
│   ├── ui/                     # Composants primitifs réutilisables
│   └── shared/                 # Composants métier partagés
│
├── lib/
│   ├── api/
│   │   ├── client.ts           # Instance axios configurée avec interceptors
│   │   └── endpoints.ts        # Toutes les URLs d'API centralisées
│   ├── auth/
│   │   └── tokens.ts           # Helpers get/set/clear tokens
│   └── utils.ts                # Utilitaires génériques (cn, formatDate…)
│
├── hooks/                      # Custom hooks (useAuth, …)
├── stores/                     # Zustand stores (authStore)
├── types/                      # Interfaces et types TypeScript globaux
│   ├── auth.types.ts
│   ├── workspace.types.ts
│   └── note.types.ts
└── middleware.ts               # Protection des routes Next.js
```

## Design System

### Colors
- **Primary**: `#1A1A2E` (bleu nuit profond) — fonds principaux
- **Accent**: `#4F46E5` (indigo) — CTA, liens actifs
- **Surface**: `#F8F8FC` (blanc cassé froid) — fonds de cartes
- **Muted**: `#6B7280` (gris neutre) — textes secondaires

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# .env.local is already configured with NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Dependencies

- **React 19** - UI library
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **Zustand** - State management
- **React Query** - Server state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Lucide React** - Icon library
- **clsx & tailwind-merge** - CSS class utilities

## Key Features

### Authentication
- Login/Register pages
- Token-based authentication with access/refresh tokens
- Automatic token refresh on 401 responses
- Middleware-based route protection
- Zustand store for auth state management

### API Integration
- Centralized API endpoints configuration
- Axios client with request/response interceptors
- Automatic Bearer token injection
- Automatic refresh token handling
- Error handling and redirect on auth failure

### Route Protection
- Public routes: `/(auth)/login`, `/(auth)/register`
- Protected routes: `/(dashboard)/*`
- Automatic redirects based on auth state
- Middleware-based validation

## Available Scripts

- `npm run dev` - Start dev server (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## TypeScript Strict Mode

This project is configured with strict TypeScript settings:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

No `any` types are allowed in this project.

## Next Steps

1. Implement login/register forms with React Hook Form + Zod
2. Implement workspaces list/detail pages
3. Implement notes CRUD operations
4. Add UI components (Button, Input, Card, etc.)
5. Add React Query integration for API calls
6. Add loading/error states and user feedback
7. Implement responsive design

## API Endpoints

The frontend consumes the following FastAPI endpoints:

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

### Workspaces
- `POST /api/workspace` - Create workspace
- `GET /api/workspaces` - List user workspaces
- `GET /api/workspace/:id` - Get workspace details
- `PUT /api/workspace/:id` - Update workspace
- `DELETE /api/workspace/:id` - Delete workspace

### Notes
- `POST /api/notes` - Create note
- `GET /api/notes?workspace_id=:id` - List notes in workspace
- `GET /api/notes/:id` - Get note details
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
