# TikTok Integration: What's Possible

> Investigation notes. Status: **the official TikTok API does not expose a user's saved/favorited videos.** This doc records what we found, what we'll build instead, and a path forward if TikTok ever opens the relevant scope.

## What the user wants

From the design chat (`design/chats/chat1.md`):

> "REvisar también el concepto de guardar recetas, si es posible conectar con los favoritos de tiktok, y buscar las recetas o algo así."

In product terms: the "Connect Socials" screen should let a user link TikTok and pull in their saved recipe videos automatically, so they don't have to paste each URL.

## What TikTok actually offers

TikTok has two developer surfaces relevant here. Both require app registration at developers.tiktok.com.

### Login Kit

OAuth2-style sign-in. Returns a user access token. Scopes:
- `user.info.basic` — display name + avatar
- `user.info.profile` — bio, link
- `user.info.stats` — follower counts
- `video.list` — **the user's own posted videos** (not saves, not favorites, not history, not "for you" likes)
- `video.upload` / `video.publish` — outbound, not relevant
- `research.adlib.basic` — ads research, not relevant

There is **no scope for accessing the user's "Favorites" / "Saved" / liked videos.** This has been the case since the API was rebuilt in 2022. There is no documented timeline for adding it.

### Display API

Requires a successful Login Kit auth + `video.list` scope. Endpoints:
- `GET /v2/user/info/` — profile
- `GET /v2/video/list/` — paginated list of the authed user's own videos
- `GET /v2/video/query/` — query specific video IDs (must be the authed user's own)

Same limitation: only own posted content.

### Embed API

Public, no auth. Given a video URL, returns an oEmbed-style iframe. **This is what the existing `flw.panteragpt.com` webhook already uses indirectly** when the user pastes a URL — TikTok exposes enough public metadata (caption, transcript when available, thumbnail) for the AI extraction to work.

## What we ship in Phase 3

The **Connect Socials** screen will:

1. Visually present "TikTok" as an integration option, matching `design/project/app/components/screens-social.jsx` `ConnectScreen`.
2. On tap, open a **bulk paste modal**: a textarea where the user pastes a list of TikTok URLs (one per line). Realistically users get these by:
   - Going to their TikTok profile → Saved → manually copying links (yes, painful, but possible for the few they really want).
   - Sharing-sheet on the TikTok app → Copy Link, one at a time.
3. We submit each URL to the existing `POST /api/recipes/capture` endpoint sequentially, with per-URL progress ("3 of 12 processed…").
4. Results land in `extracted_recipes` and appear immediately in My Recipes / the roulette pool.

This is the same data path as the single-URL capture screen — we're just batching the user's input. Zero new backend work for this flow.

The same bulk-paste UX should work for Instagram, YouTube, and Pinterest (each has the same "no public favorites API" problem, with slight variations).

## Optional: Login Kit for "import own posts"

If the user is also a creator, we *can* legitimately offer:

> "Sign in with TikTok → we'll import recipes from your last 50 posted videos."

That's a different feature ("creator import") with real API support. Worth shipping later (Phase 6+) for any user who is themselves a food creator. It's not a substitute for the favorites use case.

Implementation sketch:
- TikTok Login Kit OAuth on the client → exchange code on the server → store refresh token.
- Server-side cron or on-demand `GET /v2/video/list/` → for each video, hit the existing extraction webhook with the URL.
- Estimated effort: ~3 days.

## Optional: Browser extension for real "favorites" access

If favorites-import is critical, the only path is a **browser extension** that scrapes the user's logged-in TikTok web session:

1. User installs the Chef Roulette companion extension.
2. Extension gets activated when the user navigates to `tiktok.com/@username/saved` (or whatever the saved-videos URL is).
3. Extension reads the DOM (or the XHR responses TikTok's web client makes to its own internal endpoints) and POSTs the video URLs to our API.
4. Our API runs them through extraction.

Pros: actually does what the user asked.
Cons: this is a side product. Manifest V3 extension, separate review process for Chrome Web Store / Edge / Firefox, ~1-2 weeks to build, and any DOM/XHR change on TikTok's side breaks it. Treat as a Phase 7+ feature only if Phases 1-6 ship and users are clamoring.

## Decision

**Phase 3 ships the bulk-paste flow.** It's cheap, it works today, it covers IG/YT/Pinterest equally well, and it doesn't depend on a third party we can't influence.

**Phase 6 evaluates Login Kit** for creators (tractable, real API, real value).

**Browser extension is parked** until we have evidence users actually want this enough to install something.

## Open questions for the user

- Do you have a TikTok Developer account? We'll need one for Phase 6's Login Kit work. Setup is free; review takes 1-3 days.
- Is "creator import" interesting (you / friends post on TikTok and want auto-ingest)? If yes, we move it earlier in the backlog.
