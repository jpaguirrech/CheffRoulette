# Deployment: Firebase Hosting + Cloud Run

> Target architecture for Phase 5 of the pivot. Until Phase 5 lands, the app still runs on Replit. This doc is the runbook the deploy phase will follow.

## Topology

```
                    ┌────────────────────────────┐
   user ─────HTTPS──▶  Firebase Hosting (CDN)    │
                    │  - serves /, /assets/*,    │
                    │    /icons/*, /sw.js, etc.  │
                    │  - rewrites /api/** ──┐    │
                    └───────────────────────┼────┘
                                            │
                                            ▼
                    ┌────────────────────────────┐
                    │  Cloud Run service          │
                    │  - Express API (port $PORT) │
                    │  - validates Firebase ID    │
                    │    tokens via firebase-admin│
                    └─────────────┬──────────────┘
                                  │ DRIZZLE
                                  ▼
                    ┌────────────────────────────┐
                    │  Neon Postgres (managed)    │
                    └────────────────────────────┘

                    ┌────────────────────────────┐
                    │  flw.panteragpt.com         │  (3rd-party, recipe AI)
                    │  /webhook/social-media-recipe│ writes directly to Neon
                    └────────────────────────────┘
```

The browser sees a single origin (`reciperoulette.web.app` or custom domain) thanks to Firebase Hosting rewrites. Cloud Run is private — no direct public access — once we lock it down with `--ingress=internal-and-cloud-load-balancing`, but during initial setup we leave it `--allow-unauthenticated` and rely on Hosting being the only client.

## Project state (as of CLI bootstrap)

- **Firebase project:** `cheff-roulette` (project number `489187873945`)
- **Plan:** Spark (free) — **must upgrade to Blaze before Phase 5** for Hosting → Cloud Run rewrites to work.
- **Web app registered:** "Chef Roulette PWA", App ID `1:489187873945:web:7d953f9a0d4233ce88d408`. Public config committed at `client/src/config/firebase.ts`.
- **Auth providers:** none enabled yet. Phase 4 needs Google + Anonymous toggled in the console.
- **Hosting:** initialized via `firebase.json` at repo root, points to `dist/public`. No Cloud Run rewrite yet (added in Phase 5).
- **`.firebaserc`:** default project alias = `cheff-roulette`.

## What I need from you to run the first deploy

Before Phase 5 starts, please provide (paste here, or set as Cloud Run secrets, or hand me a service account that can read them):

1. **GCP project ID** — billing must be enabled. Currently `cheff-roulette` on Spark; **upgrade to Blaze required**.
2. **Firebase project linked to that GCP project**. Already done — same ID `cheff-roulette`.
3. **Service account JSON** for CI deploys, with these roles:
   - `roles/run.admin` (deploy to Cloud Run)
   - `roles/cloudbuild.builds.editor` (Cloud Build trigger)
   - `roles/storage.admin` (push images to GCR/Artifact Registry)
   - `roles/firebasehosting.admin` (deploy Hosting)
   - `roles/iam.serviceAccountUser` (act as Cloud Run runtime SA)
   - Save it as `FIREBASE_SERVICE_ACCOUNT` in GitHub Actions secrets, never commit.
4. **Firebase web app config** (apiKey, authDomain, projectId, etc.) — public, ships in client bundle. Get it from Firebase Console → Project Settings → General → Your apps → Web.
5. **Firebase Admin service account** (separate from #3) for the Cloud Run runtime to verify ID tokens. Roles: `roles/firebase.sdkAdminServiceAgent`. Set as `FIREBASE_ADMIN_SA_JSON` env var in Cloud Run.
6. **Neon `DATABASE_URL`** — already in use; just confirm we can read from Cloud Run. Neon supports IP allowlisting, but Cloud Run egress is dynamic — use Neon's "allow all" or set up a Serverless VPC Connector + static egress IP if that's a concern.
7. **OAuth domains:** add `reciperoulette.web.app` (and the eventual custom domain) as authorized origins/redirect URIs in Google Cloud Console → APIs & Services → Credentials → the existing OAuth client. Firebase Auth manages this if you enable Google sign-in via the Firebase Auth console.
8. **Webhook contact** — current webhook (`flw.panteragpt.com/webhook/social-media-recipe`) is unauthenticated. If the partner adds a token, we'll need it as `WEBHOOK_TOKEN`.
9. **Custom domain** (optional, post-launch): A or AAAA record to Firebase Hosting's IPs, plus a TXT record for verification.

## File layout to add (Phase 5)

```
firebase.json              # hosting config + rewrites
.firebaserc                # project alias
Dockerfile                 # Cloud Run image
.dockerignore              # node_modules, dist, .env, etc.
cloudbuild.yaml            # OR .github/workflows/deploy.yml
docs/DEPLOYMENT.md         # this file
```

### `firebase.json` (sketch)

```json
{
  "hosting": {
    "public": "dist/public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "/api/**", "run": { "serviceId": "chef-roulette-api", "region": "us-central1" } },
      { "source": "**", "destination": "/index.html" }
    ],
    "headers": [
      { "source": "/sw.js", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] },
      { "source": "/manifest.json", "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600" }] },
      { "source": "**/*.@(js|css|woff2|svg|png)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
    ]
  }
}
```

### `Dockerfile` (sketch)

```dockerfile
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

The server must read `process.env.PORT` (default 8080) — Cloud Run injects it. The current `server/index.ts` hardcodes `5000`; Phase 5 changes that to `Number(process.env.PORT) || 5000`.

## Local dev after Phase 5

`npm run dev` keeps working as before (Express + Vite middleware on 5000). You only need Firebase tooling when deploying or when testing emulators:

```
npm i -g firebase-tools
firebase login
firebase emulators:start --only hosting,auth   # optional, for full local stack
```

## Rollback

- Hosting: `firebase hosting:channel:list` → identify the previous release → `firebase hosting:rollback`.
- Cloud Run: `gcloud run services update-traffic chef-roulette-api --to-revisions=<previous-revision>=100`.
- DB: there's no auto-migration rollback. **Don't run destructive `db:push` on production without a manual SQL backup first.** Use `pg_dump` → S3/GCS before any column drop.

## Cost ceiling (eyeballed)

- Cloud Run: scale-to-zero, ~$0/mo at low traffic. Memory 256MB, CPU 1, max-instances 5 to start.
- Firebase Hosting: free tier covers our likely volume (10GB transfer/mo).
- Neon: existing.
- Cloud Build: 120 free build-min/day.
- Firebase Auth: free for our user count.

If anything goes above expected, set up budget alerts at Cloud Console → Billing → Budgets, capped at e.g. $25/mo with email alert at 50%.
