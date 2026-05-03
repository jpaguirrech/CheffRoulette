# Pivot Plan: Web App → Mobile-First PWA (Glass)

> Authoritative plan for migrating the existing CheffRoulette codebase to the design defined in `design/`. Read `design/README.md` and `design/project/README.md` first.

## Goal state

- Mobile-first installable PWA, deployed as **Firebase Hosting** (static) + **Cloud Run** (Express API) with Hosting rewrites making `/api/*` proxy to Cloud Run.
- 15 screens matching the **Glass** direction in `design/project/app/components/screens-*.jsx`, built as TSX components inside `client/src/pwa/`.
- Firebase Auth (Google + anonymous) replaces Passport-Google-OAuth.
- Neon Postgres unchanged. Drizzle schema extended with vote-session, cook-session, shopping-list, rating tables.
- Recipe extraction continues to call the `flw.panteragpt.com` webhook.
- TikTok integration: connect-flow exists in UI, but actual data ingestion uses **paste-bulk URLs** for now (see `docs/TIKTOK-INTEGRATION.md` for why the official Display API doesn't expose favorites).

## Phases

Each phase ends in a tagged release (`v0.X.0`) and an entry in `CHANGELOG.md`. Don't start a new phase before the previous one merges to `main` and the QA + design-fidelity gates pass.

### Phase 0 — Foundation (this PR)

**Status:** in progress.

- [x] Land `CLAUDE.md` constitution.
- [x] Stage `design/` snapshot in repo (read-only reference).
- [x] Write this plan, `docs/DEPLOYMENT.md`, `docs/TIKTOK-INTEGRATION.md`.
- [x] Define `qa-runner` and `design-fidelity` subagents under `.claude/agents/`.
- [x] Initialize `CHANGELOG.md`.

No application code changes. The repo still runs as before; only docs and agents are added.

### Phase 1 — Cleanup (target: `v0.1.0`)

Delete dead weight before adding new code, so the QA gate has a clean baseline.

**Delete:**
- `server/ai-service.ts`, `parseRecipeFromUrl` + `analyzeUrlForRecipeHints` + `getEnhancedFallbackRecipe` + `getFallbackRecipe` + `getDefaultImageForPlatform` from `server/routes.ts`, the `/api/test-ai-capture` route.
- `server/direct-supabase-test.ts`, `server/test-pooler-connection.ts`, `server/test-supabase-direct.ts`, `server/supabase-config.ts`, `server/seed.ts`, `server/external-api-service.ts`, `server/new-routes.ts`.
- Root `test-*.js`, `demo-webhook-flow.js`, `import-recipe-data.ts`, `setup-supabase.md`, `supabase-dump-guide.md`, `external-connection-guide.md`, `debug-production-auth.md`, `neon-database-schema.sql`.
- `client/src/pages/my-recipes-backup.txt`.
- Legacy `recipes` table + `insertRecipeSchema` + `Recipe` types from `shared/schema.ts`. Drop the table from Neon. (Run `npm run db:push --dry-run` first, capture output, get user OK before dropping.)
- All `storage.createRecipe / updateRecipe / getRecipe / getRecipes / getRandomRecipe / deleteRecipe` methods + their `IStorage` interface entries + `MemStorage` implementation file `server/storage.ts` (keep only the type interfaces that postgres-storage actually implements).
- `POST /api/recipes` and `PATCH /api/recipes/:id` (legacy serial-id routes). The list/detail/random routes stay because they already read from `extracted_recipes`.

**Add:**
- `npm run lint` via ESLint flat config (TypeScript + React).
- `npm run test` via Vitest with one smoke test that imports `server/routes.ts` without throwing.
- `npm run typecheck` as alias for `npm run check` (more discoverable).

**Verify:**
- `qa-runner` agent passes.

### Phase 2 — Tokens & shell (target: `v0.2.0`)

Replace the visual foundation without breaking the current page set.

- Regenerate `client/src/index.css` from `design/project/colors_and_type.css`. Orange primary, Fraunces + Inter, glass shadow scale.
- Update `tailwind.config.ts` to wire the new CSS vars to Tailwind color names.
- Add `client/public/manifest.json` (copy + adapt from `design/project/app/manifest.json`).
- Add `client/public/sw.js` (copy + adapt from `design/project/app/sw.js`).
- Add icons under `client/public/icons/`. SVG masked + 192/512 PNG fallbacks.
- Wire service worker registration in `client/src/main.tsx`. Skip in dev (`import.meta.env.DEV`).
- Add an **iPhone-style frame** for desktop preview (constrained max-width on lg+ screens), per the design's iOS frame approach.

Don't migrate screens yet. The existing pages will look mildly off because the tokens changed; that's acceptable until Phase 3 starts replacing them.

**Verify:**
- `design-fidelity` agent compares current screens against design tokens (typography + color only).

### Phase 3 — Screens & data (target: `v0.3.0`)

Port the 15 screens. Add the data they need.

**New schema** (additive, no breaking changes to existing tables):

```
vote_sessions:
  id uuid pk, host_user_id varchar fk users.id, code varchar(8) unique,
  status varchar (pending|active|complete), recipe_pool_size int default 20,
  created_at timestamp, completed_at timestamp

vote_session_members:
  session_id uuid fk vote_sessions.id, user_id varchar fk users.id,
  role varchar (host|guest), joined_at timestamp,
  primary key (session_id, user_id)

vote_session_recipes:
  session_id uuid fk vote_sessions.id, recipe_id uuid fk extracted_recipes.id,
  position int, primary key (session_id, recipe_id)

vote_session_swipes:
  session_id uuid, user_id varchar, recipe_id uuid,
  direction varchar (like|nope|super), created_at timestamp,
  primary key (session_id, user_id, recipe_id)

cook_sessions:
  id uuid pk, user_id varchar fk users.id, recipe_id uuid fk extracted_recipes.id,
  started_at timestamp, completed_at timestamp,
  current_step int default 0

shopping_items:
  id uuid pk, user_id varchar fk users.id,
  ingredient text, recipe_id uuid (nullable),
  quantity text, checked boolean default false, created_at timestamp

recipe_ratings:
  user_id varchar, recipe_id uuid,
  stars int (1-5), notes text, would_cook_again boolean,
  created_at timestamp,
  primary key (user_id, recipe_id)
```

**Routes** (all under `/api`):
- `POST /vote-sessions` create lobby (host only) → returns code
- `POST /vote-sessions/:code/join` join by code (anon allowed)
- `GET /vote-sessions/:id` session state + members
- `POST /vote-sessions/:id/start` (host) freeze recipe pool, return shuffled list
- `POST /vote-sessions/:id/swipes` record swipe (debounced)
- `GET /vote-sessions/:id/matches` mutual likes (sorted by count, then super-likes first)
- `POST /cook-sessions` start cooking
- `PATCH /cook-sessions/:id` advance step / complete
- `GET /shopping-items` / `POST` / `PATCH /:id/check` / `DELETE /:id`
- `POST /recipes/:id/rating` upsert rating
- `GET /me/stats` streak, points, recipes-cooked

**Screens** (port one at a time, each as its own commit):
splash → onboarding → connect → home → search → roulette → lobby → swipe → match → recipe → cook → shopping → rating → capture → profile

For each screen: read the corresponding JSX in `design/project/app/components/`, extract the layout + animations + tokens usage, then write idiomatic TSX using shadcn/Tailwind. Do **not** copy the prototype's `style={{}}` literals — translate them to Tailwind classes that read the new CSS vars.

**Routing:** keep Wouter for now. The prototype's hash-based stack router with localStorage persistence is nice but Wouter + a thin `useNavStack` hook gives us 90% of the value without a new dep.

**Verify:**
- `qa-runner` for build + smoke
- `design-fidelity` for each screen, side-by-side comparison

### Phase 4 — Auth migration (target: `v0.4.0`)

Move from Passport-Google-OAuth + connect-pg-simple sessions to Firebase Auth + ID tokens.

- Add `firebase` (client) + `firebase-admin` (server) deps.
- Client: replace `useAuth` with a Firebase Auth listener; expose `currentUser`, `signInWithGoogle`, `signInAnonymously`, `signOut`, `getIdToken`.
- Client: `apiRequest` attaches `Authorization: Bearer <idToken>`. Drop `credentials: "include"`.
- Server: `firebase-admin.initializeApp()` with service-account creds from env. Middleware `verifyFirebaseToken` reads `Authorization`, verifies, attaches `req.firebaseUser` (uid + email). Replaces `isAuthenticated`.
- DB: backfill — for each existing `users.id` (Replit/Google sub), create a corresponding Firebase user with the same UID via `admin.auth().createUser({ uid, email, ... })`. Document the script in `docs/AUTH-MIGRATION.md`.
- Anonymous users: when an anon user later signs in with Google, link via `linkWithCredential` so swipes/votes survive.
- Delete `server/googleAuth.ts`, `connect-pg-simple` dep, the `sessions` table, the `dev-user-123` fallback, the `/api/auth/dev-login` route.

**Verify:** end-to-end manual auth flow + `qa-runner`.

### Phase 5 — Deploy (target: `v0.5.0`)

Stand up production infra. See `docs/DEPLOYMENT.md` for the full runbook.

- `firebase.json` with hosting config + rewrites: `/api/**` → Cloud Run service, everything else → static.
- `Dockerfile` for Cloud Run (Node 20, run `npm run build && npm run start`).
- `cloudbuild.yaml` or GitHub Actions workflow: on push to `main`, build server image, deploy to Cloud Run, deploy hosting.
- Cloud Run env: `DATABASE_URL`, `FIREBASE_SERVICE_ACCOUNT`, `WEBHOOK_URL`, `WEBHOOK_TOKEN` (if any).
- DNS: `*.web.app` for the first cut. Custom domain in Phase 6+.
- Smoke test: capture a real TikTok URL, swipe a vote session with two devices, cook a recipe, see it in profile stats.

**Verify:** lighthouse PWA score ≥ 90; install prompt works on Android Chrome and iOS Safari (add-to-home-screen).

### Phase 6+ — Backlog

Not committed for the pivot, but tracked here so we don't forget:

- Push notifications (FCM) for friend votes and weekly challenges.
- Offline mode: cache extracted recipes for cook mode without network.
- "Pantry-aware" roulette filter (Pro tier).
- TikTok Display API integration (own posts only — see `docs/TIKTOK-INTEGRATION.md`).
- Stripe + Pro subscription gating.
- Sentry for error tracking, GA4 events for funnel.
- Internationalization (real i18n library, not just inline strings).

## Color reconciliation (open question)

The Glass design uses **orange `#FF6B35`** as primary. The pre-pivot `replit.md` stated a user preference for **green**. The CLAUDE.md treats the design as authoritative for visuals — but in Phase 2, before regenerating tokens, **confirm with the user** whether to:

1. Adopt orange as designed (recommended; it's what the user picked when shown three directions).
2. Re-skin the Glass tokens to keep brand-green primary with orange as secondary accent (preserves the existing brand).

This is a 5-minute swap either way; it's just two lines in `tokens.css`. Don't burn time arguing — ask once, do, move on.
