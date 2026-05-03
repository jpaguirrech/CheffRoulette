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

### Notes
- No application code changes in this entry. Phase 1 (cleanup) is the next merge.
- Pre-pivot history lives in `replit.md`. Going forward, all changes are tracked here.
