# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev         # Start dev server (Express + Vite middleware) on port 5000
npm run build       # Vite build client → dist/public, esbuild bundles server → dist/index.js
npm run start       # Run production build (NODE_ENV=production node dist/index.js)
npm run check       # TypeScript type-check across client/, server/, shared/
npm run db:push     # Push Drizzle schema (shared/schema.ts) to the DB at DATABASE_URL
```

There is no test runner, linter, or formatter configured. The README references `npm run lint`, `npm run format`, `npm run test`, `npm run db:studio`, etc. — those scripts do **not** exist in `package.json`. Don't suggest them as if they work.

`DATABASE_URL` is required for both the app and `drizzle-kit` (see `drizzle.config.ts`). Without it, the server throws on startup.

## Architecture

Single-port full-stack app: Express serves the API and (in dev) mounts Vite as middleware so the React client and `/api/*` are both on `http://localhost:5000`. In production, `serveStatic` serves the built client from `dist/public`. See `server/index.ts` and `server/vite.ts`.

### Layout
- `client/` — React 18 + Vite + Tailwind + shadcn/ui + Wouter + TanStack Query. Vite `root` is `client/`, so `client/index.html` is the entry.
- `server/` — Express + Passport (Google OAuth) + Drizzle ORM. Entry: `server/index.ts` → `registerRoutes` in `server/routes.ts`.
- `shared/schema.ts` — Drizzle table definitions + `drizzle-zod` insert/update schemas + inferred types. Imported by both client and server via `@shared/*`.
- `attached_assets/` — Static assets aliased as `@assets`.

### Path aliases (vite.config.ts + tsconfig.json)
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

### Recipe data model — two parallel systems
The schema has **two recipe representations** that coexist:

1. **Legacy** `recipes` table (integer `serial` IDs) with embedded source fields. Insert/update via `insertRecipeSchema` and `storage.createRecipe/updateRecipe`. Used by `POST /api/recipes` and `PATCH /api/recipes/:id`.
2. **Current** `social_media_content` + `extracted_recipes` tables (UUID PKs). Recipes belong to a `socialMediaContent` row, which holds the `userId` and source URL. Ownership checks must traverse the join (see `PATCH /api/extracted-recipes/:id` in `server/routes.ts`).

The user-facing list and detail routes (`GET /api/recipes`, `GET /api/recipes/:id`, `GET /api/recipes/random`) read from the **extracted_recipes** path via `server/neon-routes.ts`, not the legacy table. When adding recipe-read features, use `neon-routes.ts` helpers; when editing recipes, use `updateExtractedRecipeSchema` and the UUID route. Route ordering matters: `/api/recipes/random` must be registered before `/api/recipes/:id` (already done in `routes.ts`).

### Recipe ingestion flow
`POST /api/recipes/capture` does **not** run AI locally. It posts the URL + userId to an external webhook at `flw.panteragpt.com/webhook/social-media-recipe` (`server/webhook-service.ts`). That service performs extraction and writes the resulting `social_media_content` + `extracted_recipes` rows directly into the same Neon DB the app reads from. The route then re-fetches the recipe via `neon-routes.getRecipeById` to return full details.

The webhook returns either an array or object shape — `WebhookRecipeService.processVideoRecipe` parses both and falls back to a heuristic. If parsing fails, the route checks for a recipe created in the last 5 minutes for the user and treats that as success (handles webhook-side write succeeding while response shape is off). Don't simplify this away without understanding the partner API.

`server/ai-service.ts` (Gemini) and the `parseRecipeFromUrl` helpers in `routes.ts` are **legacy**, only wired up to `POST /api/test-ai-capture`. The production capture path is the webhook.

### Storage layer
`server/storage.ts` defines `IStorage` and a `MemStorage` implementation; the live binding is `storage` exported from `server/postgres-storage.ts` (Drizzle + postgres-js against `DATABASE_URL`). Always import `storage` from `./postgres-storage`, not `./storage`. `server/db.ts` is the shared `drizzle` client.

Files like `server/direct-supabase-test.ts`, `test-pooler-connection.ts`, `supabase-config.ts`, and root-level `test-*.js`/`demo-*.js`/`*-supabase*.md` are leftover migration/debug scripts from the Supabase→Neon move. They are not part of the runtime — don't import them.

### Auth
`server/googleAuth.ts` sets up Passport Google OAuth and session middleware. Session store: `connect-pg-simple` against `DATABASE_URL` in production, in-memory store in development. Required env: `SESSION_SECRET` (enforced in production), Google OAuth client id/secret.

In **development**, when no real session exists, several routes fall back to a hardcoded mock user `dev-user-123` (see `/api/auth/user`, `/api/recipes/capture`, `/api/user-actions`). Treat this as expected dev behavior, not a bug. The protected `PATCH /api/extracted-recipes/:id` uses `isAuthenticated` and does **not** fall back. When adding write endpoints, derive `userId` from `req.user`, never trust a client-supplied `userId` (see the explicit comment + `_` rename in `/api/user-actions`).

### Frontend
Routing in `client/src/App.tsx` is split by `useAuth()` — unauthenticated users get Landing/About/Privacy/Terms plus a `/demo` Dashboard; authenticated users get Dashboard/MyRecipes/Profile/RecipeDetail. `useAuth` is just a TanStack Query against `/api/auth/user` (`client/src/hooks/useAuth.ts`).

API calls go through `apiRequest` / `getQueryFn` in `client/src/lib/queryClient.ts`. Both send `credentials: "include"` for session cookies. The default query config has `staleTime: Infinity` and no retries — pages must invalidate queries explicitly after mutations.

UI components in `client/src/components/ui/` are shadcn/ui (style: "new-york", baseColor: "neutral"). Add new shadcn components via the CLI rather than hand-writing them. App-level components live one level up in `client/src/components/`.

Google Analytics is initialized from `VITE_GA_MEASUREMENT_ID` in `App.tsx`; missing it logs a warning but doesn't break the app.

## Conventions specific to this repo

- Server is **ESM** (`"type": "module"`) and uses `tsx` in dev. Server imports from `@shared/schema` work because of the `@shared/*` path alias.
- Drizzle migrations are not committed — schema changes are applied via `npm run db:push`. The migrations output dir is `./migrations` per `drizzle.config.ts` but is not tracked.
- `replit.md` carries product/changelog context and a stated user preference for a **green** color palette over the README's orange/teal — follow `replit.md` for color choices.
- The app must bind to port 5000 on Replit; this is hardcoded in `server/index.ts` with a comment explaining it's the only non-firewalled port.
