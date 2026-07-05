# Backlog

Pick from the top of the active list. Mark status inline when starting/finishing. Completed item specs move to `archive/BACKLOG_ARCHIVE.md`.

**Context cost key**: S = Small (<5% context), M = Medium (5–15%), L = Large (15–30%), XL = Extra Large (>30%)

**Status key**: TODO | IN PROGRESS | DONE | BLOCKED | NO-OP | FUTURE | WAITING

---

## Active Items

### BL-001 — Auth/business-data server-proxy refactor: finished and verified, two items still need backend work in other repos `[L]`
- **What**: A large batch of uncommitted work migrated auth and business-data logic from direct client-side Supabase calls to a server-side "Gatekeeper" proxy pattern (`lib/auth.ts`, `lib/api.ts`/`lib/api.server.ts`, new `app/api/*` proxy routes, a new "Business Data" Sidebar section under `app/(dashboard)/business/*`, and a public `app/(public)/search` page). It was picked back up and finished in this session — decision made: finish it, not shelve it.
  - Fixed and committed: missing `app/api/partners` route (removes a silent super-admin regression on the mice page), `lib/api.server.ts`'s server-side `getAllPartners`/`getPartnerBusiness`/`checkPermissions` now query Supabase directly instead of round-tripping through a same-origin `fetch()` that silently dropped the user's auth cookie (a real bug — every call would have returned "unauthenticated"), `intelligenceApi`/`conversionApi`/`pricingApi`/`entitiesApi.getProfile` in `lib/api.server.ts` were hitting the wrong backend host entirely (routed through the external-API base URL instead of doing the real work in-process) — confirmed via live `curl` against production that `/business/intelligence`, `/business/conversions`, and `/business/growth` were unconditionally showing their error/offline states for any real logged-in user; now fixed. Also fixed several build-breaking issues in the staged code: missing `Target`/`Zap` icon imports in `Sidebar.tsx`, a missing `conversionApi` export in `api.server.ts`, a typo'd `PhoneCalls` → `PhoneCall` lucide import (and the wrong icon was wired to the wrong stat), a missing `uuid` dependency in `SearchUI.tsx` (replaced with built-in `crypto.randomUUID()`), and an implicit-`any` param in `BusinessProfileForm.tsx`. `npm run build` and `tsc --noEmit` are both clean (two remaining type errors are pre-existing/unrelated, from commit `3aaae314`, not part of this work).
  - Verified live against production, not guessed: `https://api.localplus.city/api/categories` works and returns real data; `https://mc-m6cckgy66k.bunny.run/entities/upsert` (POST) exists (401 without auth = real route); `GET .../businesses/:id` exists on that same AE backend and is now used for `entitiesApi.getProfile` instead of the nonexistent `GET /entities/:id`.
  - Two genuine gaps remain — **not fixable from this repo**, need backend work elsewhere:
    1. **Categories aren't split by cuisine vs. feature.** `taxonomyApi.getCategories('cuisine')` and `('feature')` both hit `api.localplus.city/api/categories`, which returns the *same* WordPress event/music-genre taxonomy (glam rock, dance genres, etc.) regardless of the `type` param — confirmed via live curl, the param is a no-op server-side. There is no real cuisine/feature taxonomy backing this yet. `business/profile/page.tsx`'s cuisine and feature pickers will show identical, irrelevant options until `localplus-api` (or a new source) implements a real split.
    2. **Partner analytics endpoints don't exist yet.** `https://api.localplus.city/analytics/partner-intelligence` and `/analytics/pricing` both return `404 NOT_FOUND` in production (confirmed via live curl) — not implemented on the backend at all. `/business/intelligence`, `/business/conversions`, and `/business/growth` will show mock/placeholder numbers, not real metrics, until those two endpoints are actually built server-side.
- **Acceptance criteria**: Done for everything fixable in this repo. Remaining: `localplus-api`/AE builds real `/analytics/partner-intelligence` and `/analytics/pricing` endpoints, and a decision + implementation for a real cuisine/feature category split.
- **Files**: `lib/auth.ts`, `lib/api.ts`, `lib/api.server.ts`, `components/Sidebar.tsx`, `app/(dashboard)/layout.tsx`, `app/page.tsx`, `app/api/auth/me`, `app/api/roles/me`, `app/api/partners`, `app/api/partners/me`, `app/api/entities/*`, `app/api/categories`, `app/api/mice/*`, `app/api/partner/*`, `app/api/public/*`, `app/(dashboard)/business/*`, `app/(public)/search`.
- **Blocker**: The two backend-dependent items above (analytics endpoints, cuisine/feature taxonomy) need work in `localplus-api`/AE, not `localplus-partner`.
- **Role**: Feature Development
- **Status**: IN PROGRESS

---

## Future (no scope yet — do not build)

| Item | Description |
|---|---|
| BL-NNN | [Brief description — scoped when ready] |

---

## Completed

| Item | Date | Summary |
|---|---|---|

---

<!--
INSTRUCTIONS:

- The Product role writes items; the Feature Development role executes them.
- Pick the top-most TODO item each session. Mark IN PROGRESS when you start; DONE when verified; NO-OP if found unnecessary.
- BLOCKED items: skip entirely. Surface in Stop Report only.
- FUTURE items: do not build without explicit human scope definition.
- Move completed items to the Completed table (summary only) when detail is no longer needed.
- Add [S/M/L/XL] context cost to each item header.
- Add Role: tag so agents know which role handles each item.
- Add Source: tag if the item originated from an external review (reviews/filename). Optional for items from other sources.
-->
