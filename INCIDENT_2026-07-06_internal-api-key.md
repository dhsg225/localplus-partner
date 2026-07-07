# FYI for other agents — Bookings 500, same-day regression (2026-07-06)

**Audience:** any agent/session working in `localplus-api` or `localplus-partner`.
**Status:** fixed locally. One thing still needs checking (see "Open" below).

## What broke
Loading `/bookings` in `localplus-partner` (dev, port 3411) threw an unhandled
`Error: Authentication required`, surfaced via `lib/api.server.ts` → `apiRequest`.
Same failure hits `GET /api/bookings` on the live container directly.

## Root cause
`localplus-api/server.mjs` commit `23b81b3` ("real JWT verification, auth on
newly-exposed bookings/businesses/etc.", 2026-07-06) added a `requireAuth`
check to `GET /api/bookings` (and businesses/restaurants/notifications/etc).
Trusted server-to-server callers (like `localplus-partner`'s backend) are
meant to authenticate via a shared secret, `INTERNAL_API_KEY`, checked in
`isInternalCall()` (`server.mjs:34-36`).

That secret **was already set on the live Bunny container** (`localplus-api`,
app id `xW9krVSfgKmbhk4`) — but `localplus-partner`'s local `.env.local` never
defined it, so `apiRequest` was sending `Authorization: Bearer ` (empty) on
every request. Confirmed by hand: the container's existing key, sent via curl,
returns `200`; no key returns `401`.

This wasn't caught by whoever last said "bookings is working" because the
auth-hardening commit landed the same day, after that check.

## Fix applied
- Added `INTERNAL_API_KEY=<value>` to `localplus-partner/.env.local` (gitignored,
  matches the value already in the Bunny container's env vars for `localplus-api`).
- No changes made to the live container — its config was already correct.
- **Get the actual key value from Bunny Dashboard → Magic Containers →
  `localplus-api` → Environment Variables**, or from whoever has the current
  `localplus-partner/.env.local`. Not repeated in this doc on purpose — it's a
  live secret, don't paste it into anywhere that isn't gitignored.

## If you're touching either repo
- **`localplus-api`**: any route wired through `requireAuth`/`requireAdmin` in
  `server.mjs` now needs either a real user JWT or that shared secret from the
  caller. If you add a new trusted server-to-server route, this is the pattern
  to reuse — don't invent a second mechanism.
- **`localplus-partner`**: `lib/api.server.ts`'s `apiRequest()` always sends
  `INTERNAL_API_KEY`, never the end-user's session JWT — it's a pure
  server-to-server trust boundary. If `INTERNAL_API_KEY` is unset locally,
  every `apiRequest`-based call (events, bookings, staff, venues, categories,
  discovery) will silently 401, not just bookings — bookings is just what
  someone happened to click first.
- **Any other client hitting `mc-p1bm8gzkgs.b-cdn.net`** (mobile app, other
  agents' work-in-progress) — check whether it also needs `INTERNAL_API_KEY`
  wired in, or whether it's meant to authenticate as a real user instead.

## Open — not yet checked
`localplus-partner` has a Vercel project on file (`.vercel/project.json`,
`prj_DQXuR9b1tDrdLBfl12U4VGVbmilM`) but its settings look stale/Vite-era, so
it's unconfirmed whether that's actually the live prod deployment target. If
it is, and `localplus-partner` gets deployed there, **prod also needs
`INTERNAL_API_KEY` set** (Vercel project env vars) or this same bug reappears
in production. Whoever deploys `localplus-partner` next should confirm this
before shipping.

## Why this is worth a shared note
Root cause here was two repos (`localplus-api`, `localplus-partner`) each
holding half of a secret-matching contract, changed by different work on the
same day, with no single place either side recorded "the other side needs to
match this." Worth considering `agent-os` governance (DECISIONS.md/BACKLOG.md)
in `localplus-api` too — `localplus-partner` already has a `BACKLOG.md` but
`localplus-api` has neither, which is exactly the kind of asymmetry that lets
this kind of drift happen.
