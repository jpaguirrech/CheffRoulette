# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. It is the **constitution** for this project: every agent and contributor (human or AI) must follow it.

## Language policy (hard rule)

- **All code, identifiers, comments, commit messages, branch names, PR descriptions, docs in `docs/`, and inline assistant updates that end up committed MUST be in English.**
- The user communicates with assistants in **Spanish**. Assistants reply to the user in **Spanish** in chat, but anything they write to disk is English.
- If a string is user-facing UI copy, it follows the bilingual EN/ES brand voice spelled out in `design/project/README.md` ("Content fundamentals" section). That's product copy, not source-code language — treat it as data.

## Product direction (post-pivot, 2026-05)

The project is mid-pivot from a desktop-first React/Express web app to a **mobile-first installable PWA** with a Glass visual direction. The authoritative design bundle is checked in at `design/` (do not modify it; it's a snapshot). Read `design/README.md` and `design/project/README.md` before touching UI.

**Target shape:**
- **Frontend:** Vite + React 18 + Tailwind + shadcn/ui, packaged as a PWA (manifest, service worker, install prompt). Mobile-first; desktop is a constrained-width view.
- **Backend:** Express + Drizzle (unchanged in shape), deployed to **Cloud Run**.
- **Hosting:** **Firebase Hosting** for the static PWA, with rewrites to Cloud Run for `/api/*`.
- **Auth:** **Firebase Auth** (Google, anonymous for vote-session guests). Replaces Passport-Google-OAuth.
- **DB:** **Neon Postgres** (unchanged). Drizzle schema lives in `shared/schema.ts`.
- **AI extraction:** unchanged — webhook at `flw.panteragpt.com/webhook/social-media-recipe`.

**The phased plan is in `docs/PIVOT-PLAN.md`. Don't start a new phase without reading it.**

## Commands

```bash
npm run dev         # Express + Vite middleware on port 5000 (legacy dev mode; pre-pivot)
npm run build       # Vite build → dist/public, esbuild server → dist/index.js
npm run start       # Production: NODE_ENV=production node dist/index.js
npm run check       # tsc --noEmit across client/, server/, shared/
npm run db:push     # drizzle-kit push to DATABASE_URL (no migrations committed)
```

There is no test runner, linter, or formatter configured. The original README references `npm run lint`, `npm run test`, etc. — those scripts do **not** exist. Don't suggest them as if they work. Adding Vitest + ESLint + Prettier is on the roadmap (`docs/PIVOT-PLAN.md` Phase 1).

`DATABASE_URL` is required for both the app and `drizzle-kit`. Without it, the server throws on startup.

## Architecture

Single-port full-stack app: Express serves the API and (in dev) mounts Vite as middleware so the React client and `/api/*` are both on `http://localhost:5000`. In production, `serveStatic` serves the built client from `dist/public`. See `server/index.ts` and `server/vite.ts`.

**This will change after the pivot lands** — production will be Firebase Hosting (static) + Cloud Run (API) on different origins, with `firebase.json` rewrites making them appear same-origin to the browser.

### Layout
- `client/` — React 18 + Vite + Tailwind + shadcn/ui + Wouter + TanStack Query. Vite `root` is `client/`.
- `server/` — Express + Passport (Google OAuth) + Drizzle. Entry: `server/index.ts` → `registerRoutes` in `server/routes.ts`.
- `shared/schema.ts` — Drizzle tables + `drizzle-zod` schemas + inferred types. Imported by both client and server via `@shared/*`.
- `design/` — read-only design snapshot (HTML/JSX prototype + tokens + chat transcripts + product README). **Source of truth for visual decisions.**
- `docs/` — pivot plan, deployment guide, integration notes. All English.
- `.claude/agents/` — custom subagent definitions (qa-runner, design-fidelity).
- `attached_assets/` — static assets aliased as `@assets`.

### Path aliases (vite.config.ts + tsconfig.json)
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

### Recipe data model
The schema currently has **two recipe representations** that coexist. The pivot deletes one of them.

1. **Legacy** `recipes` table (integer `serial` IDs). **Marked for deletion in Phase 1** of the pivot. Don't add features that depend on it.
2. **Canonical** `social_media_content` + `extracted_recipes` tables (UUID PKs). Recipes belong to a `socialMediaContent` row, which holds the `userId` and source URL. Ownership checks must traverse the join (see `PATCH /api/extracted-recipes/:id` in `server/routes.ts`).

The user-facing list and detail routes (`GET /api/recipes`, `GET /api/recipes/:id`, `GET /api/recipes/random`) read from `extracted_recipes` via `server/neon-routes.ts`, not the legacy table. Route ordering matters: `/api/recipes/random` must be registered before `/api/recipes/:id` (already done in `routes.ts`).

### New tables coming in the pivot
See `docs/PIVOT-PLAN.md` Phase 3 for the full schema. Summary: `vote_sessions`, `vote_session_members`, `vote_session_recipes`, `vote_session_swipes`, `cook_sessions`, `shopping_items`, `recipe_ratings`. All UUID-keyed, all join through `users.id`.

### Recipe ingestion flow
`POST /api/recipes/capture` does **not** run AI locally. It posts the URL + userId to `flw.panteragpt.com/webhook/social-media-recipe` (`server/webhook-service.ts`). That service performs extraction and writes the resulting `social_media_content` + `extracted_recipes` rows directly into the Neon DB the app reads from. The route then re-fetches the recipe via `neon-routes.getRecipeById` to return full details.

The webhook returns either an array or object shape — `WebhookRecipeService.processVideoRecipe` parses both and falls back to a heuristic. If parsing fails, the route checks for a recipe created in the last 5 minutes for the user and treats that as success (handles webhook-side write succeeding while response shape is off). Don't simplify this away without understanding the partner API.

`server/ai-service.ts` (Gemini) and the `parseRecipeFromUrl` helpers in `routes.ts` are **legacy and slated for deletion in Phase 1**. The production capture path is the webhook.

### Storage layer
`server/storage.ts` defines `IStorage` and a `MemStorage` implementation; the live binding is `storage` exported from `server/postgres-storage.ts` (Drizzle + postgres-js against `DATABASE_URL`). Always import `storage` from `./postgres-storage`, not `./storage`. `server/db.ts` is the shared `drizzle` client.

Files like `server/direct-supabase-test.ts`, `test-pooler-connection.ts`, `supabase-config.ts`, root `test-*.js`/`demo-*.js`/`*-supabase*.md`, `import-recipe-data.ts`, `server/seed.ts` are **leftover migration/debug scripts** from the Supabase→Neon move and pre-pivot experiments. They are not part of the runtime — Phase 1 deletes them.

### Auth (current → target)
**Current:** `server/googleAuth.ts` sets up Passport Google OAuth + session middleware. Session store: `connect-pg-simple` against `DATABASE_URL` in production, in-memory in dev. Required env: `SESSION_SECRET`, Google OAuth client id/secret. Dev fallback hardcodes `dev-user-123`.

**Target (Phase 4):** Firebase Auth on the client (Google + anonymous), Cloud Run validates Firebase ID tokens via `firebase-admin`. `users` table keeps the same shape; `users.id` will store the Firebase UID. Anonymous users are first-class for vote-session guests (they can swipe without committing to an account; later upgrade to Google preserves their swipes).

When adding write endpoints, derive `userId` from the verified token, never from a client-supplied `userId`. The current `/api/user-actions` already rejects client `userId` (see the `_` rename); follow that pattern.

### Frontend (current → target)
**Current:** Routing in `client/src/App.tsx` is split by `useAuth()`. `useAuth` is a TanStack Query against `/api/auth/user`. shadcn/ui style "new-york", baseColor "neutral". Tokens in `client/src/index.css`.

**Target:** Mobile-first PWA shell. 15 screens from the design bundle ported to TSX (see `design/project/app/components/screens-*.jsx` for source-of-truth structure). Hash-based stack router with persisted nav stack in localStorage. Tokens regenerated from `design/project/colors_and_type.css` — Fraunces (display) + Inter (body), orange-primary `#FF6B35` (note: this overrides the older "green palette" preference in `replit.md` — design wins). Service worker, manifest, install prompt.

API calls go through `apiRequest` / `getQueryFn` in `client/src/lib/queryClient.ts`. Both send `credentials: "include"`. Default query config has `staleTime: Infinity` and no retries — pages must invalidate queries explicitly after mutations. **Keep this** — it's solid.

## Versioning

- **Semantic versioning** on the `version` field in `package.json`. Major = breaking API or schema change requiring data migration. Minor = new screens or endpoints. Patch = bug fixes.
- **Conventional commits** for the subject line: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`, `perf:`. Optional scope: `feat(roulette): …`. Body wraps at 72 cols.
- **Branches:** `claude/<short-slug>-<random>` for Claude-driven work (already the convention from CI). For human work, `feat/<slug>`, `fix/<slug>`, `chore/<slug>`. **Never push directly to `main`.**
- **Tags:** `vX.Y.Z` on every deploy to production. Created by the release flow, not by hand.
- **CHANGELOG.md** at the repo root. Keep "Unreleased" section at the top; on release, rename it to the version + date and start a new "Unreleased". Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- **Database migrations:** until the pivot's Phase 3 lands, schema is applied via `npm run db:push`. After Phase 3, all schema changes go through `drizzle-kit generate` + checked-in SQL files under `migrations/`. Never edit a committed migration; always add a new one.

## Quality gates (mandatory before merging to `main`)

Every merge to `main` must pass two automated checks. Both are implemented as Claude Code subagents:

1. **`qa-runner`** (`.claude/agents/qa-runner.md`) — runs `npm run check`, `npm run build`, smoke-tests the dev server, exercises critical flows, reports a punch list. Must pass before review starts.
2. **`design-fidelity`** (`.claude/agents/design-fidelity.md`) — for any PR touching `client/`, compares the implementation to the relevant screen in `design/project/app/components/screens-*.jsx`. Reports color, spacing, typography, and animation deviations.

Invoke them with the `Agent` tool when wrapping up a feature. They produce text reports — paste the relevant findings into the PR description.

## Conventions specific to this repo

- Server is **ESM** (`"type": "module"`) and uses `tsx` in dev. Server imports from `@shared/schema` work because of the `@shared/*` path alias.
- Drizzle migrations are not committed (yet — see Phase 3 of `docs/PIVOT-PLAN.md`). Schema changes are applied via `npm run db:push`.
- `replit.md` is **legacy product/changelog context** — useful for history but not authoritative. The design bundle and `docs/` folder are authoritative going forward. The "green palette" preference noted there is **superseded** by the Glass design (orange primary).
- The current dev server hardcodes port 5000 for Replit (see comment in `server/index.ts`). After Phase 5 (Cloud Run deploy), the port comes from `process.env.PORT` per Cloud Run convention; the `5000` hardcode becomes a dev-only fallback.
- `.replit` is legacy. Don't add new Replit-specific config; we're moving off it.

## Doing risky things

The "Executing actions with care" section at the top of the harness applies. Specific to this repo:

- **Never** drop tables or run destructive `drizzle-kit` commands without an explicit user "yes." `npm run db:push` *can* drop columns silently — always preview with `--dry-run` first, or by reading the diff in `node_modules/drizzle-kit/`.
- **Never** push to `origin main`. Always push to a feature branch and open a PR.
- **Never** commit secrets. `DATABASE_URL`, OAuth client secrets, Firebase service account JSON, webhook tokens — none of these belong in the repo. Use `.env` (gitignored) locally and Cloud Run / GitHub Actions secrets in CI.
- **Never** delete `design/`. It's the source of truth for visual decisions and includes user-design chat history.
