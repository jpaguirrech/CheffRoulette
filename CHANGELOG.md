# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Foundational `CLAUDE.md` constitution covering language policy (English code, Spanish chat), pivot direction, versioning rules, and quality gates.
- `design/` snapshot of the Glass PWA design bundle (read-only reference for all UI work).
- `docs/PIVOT-PLAN.md` — phased roadmap from current web app to mobile-first PWA on Firebase Hosting + Cloud Run.
- `docs/DEPLOYMENT.md` — target topology, Dockerfile + firebase.json sketches, credential checklist.
- `docs/TIKTOK-INTEGRATION.md` — investigation of TikTok Login Kit / Display API, conclusion that favorites are not exposed, decision to ship bulk-paste UX in Phase 3.
- `.claude/agents/qa-runner.md` — subagent that runs typecheck/build/smoke checks and reports regressions.
- `.claude/agents/design-fidelity.md` — subagent that compares implemented screens against the design bundle and flags deviations.
- This changelog.

### Added (CLI bootstrap)
- `firebase-tools` as devDependency.
- `firebase.json` with Hosting config (cache headers, SPA fallback). No Cloud Run rewrite yet.
- `.firebaserc` with `cheff-roulette` as default project alias.
- `client/src/config/firebase.ts` with the public web SDK config (apiKey is project-identifier, not a secret).
- Web app "Chef Roulette PWA" registered in the Firebase project via CLI.

### Removed (Phase 1 cleanup)
- Legacy `recipes` table from `shared/schema.ts` (Drizzle definition + `insertRecipeSchema`).
- All legacy storage methods: `createRecipe`, `updateRecipe`, `deleteRecipe`, `getRecipe`, `getRecipes`, `getRandomRecipe`.
- `server/storage.ts` (`MemStorage` + `IStorage` interface). Live binding stays at `server/postgres-storage.ts`.
- `server/ai-service.ts` (Gemini local extraction; production uses the webhook).
- Legacy AI helpers from `server/routes.ts`: `parseRecipeFromUrl`, `analyzeUrlForRecipeHints`, `getEnhancedFallbackRecipe`, `getFallbackRecipe`, `getDefaultImageForPlatform`, `getPlatformFromUrl`.
- Legacy routes: `POST /api/recipes`, `PATCH /api/recipes/:id` (serial-id), `POST /api/test-ai-capture`.
- Supabase migration scripts: `server/direct-supabase-test.ts`, `server/test-pooler-connection.ts`, `server/test-supabase-direct.ts`, `server/supabase-config.ts`, `server/seed.ts`, `server/external-api-service.ts`, `server/new-routes.ts`.
- Root debug scripts: `test-*.js` (6 files), `demo-webhook-flow.js`, `import-recipe-data.ts`, `setup-supabase.md`, `supabase-dump-guide.md`, `external-connection-guide.md`, `debug-production-auth.md`, `neon-database-schema.sql`.
- `client/src/pages/my-recipes-backup.txt`.
- `@google/genai` dependency.

### Changed (Phase 1 cleanup)
- `shared/schema.ts`: `userRecipeActions.recipeId` is now `uuid` (was `integer`) so it correctly references `extractedRecipes.id`. **Requires DB migration — see DB DDL section below; not yet applied.**
- `shared/schema.ts`: introduced legacy `Recipe` / `InsertRecipe` presentation types (transformed shape, not raw DB row) to keep current React pages compiling until Phase 3 rebuilds them.
- `server/routes.ts`: rewritten to half its previous size — only the canonical endpoints remain. `/api/recipes/random` still registered before `/:id`; `POST /api/user-actions` still strips client-supplied `userId`.
- `client/src/hooks/useAuth.ts`: typed `useQuery<User | null>` so `user.id` resolves cleanly.
- `server/neon-routes.ts`: removed references to non-existent `socialMediaContent` columns (`author`, `authorUsername`, `duration`, `views`, `likes`).
- `server/webhook-service.ts`: re-thrown errors now propagate `cause` per Node 16+ convention.

### Added (Phase 1 cleanup)
- `npm run lint` — ESLint flat config (`eslint.config.js`), TypeScript-aware, ignores `dist/`, `design/`, shadcn `client/src/components/ui/`.
- `npm run test` / `npm run test:watch` — Vitest with `vitest.config.ts` mirroring the Vite path aliases. Initial smoke test at `shared/schema.test.ts` (4 cases on Zod validators).
- `npm run typecheck` alias for `npm run check` (more discoverable).

### Quality gate status
- ✅ `npm run check` (TypeScript)
- ✅ `npm run build` (Vite + esbuild)
- ✅ `npm run test` (4/4 Vitest)
- ✅ `npm run lint` (0 errors, 22 warnings on legacy client code that Phase 3 rewrites)

### Notes
- Pre-pivot history lives in `replit.md`. Going forward, all changes are tracked here.
- Firebase project is on Spark plan; **upgrade to Blaze is a Phase 5 prerequisite** for Cloud Run rewrites.
- DB schema in Neon still has the legacy `recipes` table and the old `recipe_id integer` column. Drop those via `npm run db:push` once the user has approved the DDL — see `docs/PIVOT-PLAN.md` Phase 1.
