# Setup Instructions

## Prerequisites
- Node.js 18+ 
- npm or yarn

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages:
- ✅ `axios` — appels HTTP
- ✅ `zustand` — state management global
- ✅ `@tanstack/react-query` — server state, cache, loading/error
- ✅ `react-hook-form` — gestion des formulaires
- ✅ `zod` — validation des schémas
- ✅ `@hookform/resolvers` — bridge entre zod et react-hook-form
- ✅ `clsx` et `tailwind-merge` — utilitaire className
- ✅ `lucide-react` — icônes

## Step 2: Environment Setup

The `.env.local` file is already configured:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Make sure your FastAPI backend is running on `http://localhost:8000`.

## Step 3: Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure Verification

The complete project structure has been created:

```
✅ src/app/                          # Next.js App Router
   ✅ (auth)/login                   # Public login page
   ✅ (auth)/register                # Public register page
   ✅ (dashboard)/layout             # Dashboard layout with navbar
   ✅ (dashboard)/workspaces         # Protected workspaces list
   ✅ (dashboard)/workspaces/[id]    # Protected workspace detail
   ✅ layout.tsx                      # Root layout
   ✅ page.tsx                        # Redirect handler
   ✅ globals.css                     # Tailwind + design system

✅ src/components/
   ✅ ui/                             # Primitive components folder
   ✅ shared/                         # Business components folder

✅ src/lib/
   ✅ api/
      ✅ client.ts                    # Axios instance with interceptors
      ✅ endpoints.ts                 # Centralized API endpoints
   ✅ auth/
      ✅ tokens.ts                    # Token management helpers
   ✅ utils.ts                        # Utility functions (cn, formatDate)

✅ src/hooks/
   ✅ useAuth.ts                      # Authentication hook
   ✅ useHydration.ts                 # Store hydration hook
   ✅ index.ts                        # Exports

✅ src/stores/
   ✅ auth.store.ts                   # Zustand auth store

✅ src/types/
   ✅ auth.types.ts                   # Auth types
   ✅ workspace.types.ts              # Workspace types
   ✅ note.types.ts                   # Note types
   ✅ index.ts                        # Type exports

✅ src/middleware.ts                  # Next.js route protection

✅ Configuration Files
   ✅ package.json                    # Dependencies + scripts
   ✅ tsconfig.json                   # TypeScript strict config
   ✅ tailwind.config.ts              # Design system with 4 colors
   ✅ postcss.config.js               # Tailwind CSS processing
   ✅ next.config.js                  # Next.js configuration
   ✅ .env.local                      # Environment variables
   ✅ .eslintrc.json                  # ESLint configuration
   ✅ .gitignore                      # Git ignore rules
```

## Design System

The Tailwind configuration includes exactly 4 brand colors:

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#1A1A2E` | Backgrounds, sidebar, main UI |
| **Accent** | `#4F46E5` | CTAs, active states, highlights |
| **Surface** | `#F8F8FC` | Card backgrounds, pages |
| **Muted** | `#6B7280` | Secondary text, placeholders |

All colors have `foreground` variants for text contrast.

## API Client Features

### Request Interceptor
- Automatically injects `Authorization: Bearer <token>` header
- Reads token from Zustand auth store

### Response Interceptor
- On 401 Unauthorized:
  1. Attempts to refresh token via `POST /auth/refresh`
  2. Updates store with new access token
  3. Retries original request with new token
  4. If refresh fails, clears auth and redirects to `/login`

## Route Protection

### Middleware Rules
- ✅ `/(auth)/*` - Public, no token required
- ✅ `/(dashboard)/*` - Protected, redirects to `/login` if no token
- ✅ `/` - Redirects to `/workspaces` if authenticated, `/login` otherwise

### Authentication Flow
1. User visits `/login` or `/register`
2. After successful login, stored in Zustand + localStorage
3. Access token automatically included in API requests
4. Protected routes behind middleware
5. Token refresh handled automatically

## TypeScript Configuration

All files are configured with strict TypeScript:
- `strict: true` - All type checking enabled
- `noUncheckedIndexedAccess: true` - Array/object access is checked
- `noImplicitReturns: true` - Function returns must be explicit
- `noFallthroughCasesInSwitch: true` - Switch cases must break/return

**No `any` types allowed!**

## Next Steps for Development

1. **Forms**: Implement login/register forms with React Hook Form + Zod validation
2. **Components**: Create UI components (Button, Input, Card, Modal, etc.)
3. **Data Fetching**: Add React Query for efficient API calls and caching
4. **Workspaces**: Implement workspace list, create, update, delete
5. **Notes**: Implement notes CRUD operations
6. **UX**: Add loading states, error handling, notifications
7. **Styling**: Enhance UI with proper component styling

## Troubleshooting

### Port Already in Use
```bash
# Change port if 3000 is in use
npm run dev -- -p 3001
```

### API Connection Issues
- Verify backend is running on `http://localhost:8000`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check browser console for CORS errors

### TypeScript Errors
```bash
npm run type-check
```

### ESLint Issues
```bash
# Auto-fix linting issues
npx eslint --fix src/
```

## Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run type-check      # Check types
npm run lint            # Run ESLint

# Production
npm run build           # Build for production
npm start               # Start production server
```

---

**Project Status**: ✅ Foundation complete - ready for feature development
