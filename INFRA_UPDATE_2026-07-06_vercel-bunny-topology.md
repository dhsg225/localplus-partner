# FYI for other agents — deployment topology, corrected (2026-07-06)

**Drop this into any other agent session working on LocalPlus repos.** Several agents
today (independently) held different beliefs about what's actually deployed where. This
is the corrected, verified-live picture as of 2026-07-06. See also
`INCIDENT_2026-07-06_internal-api-key.md` in this repo for the bug that triggered this audit.

**2026-07-07 update — the Bunny container's public hostname changed.** The address below
was `mc-ucz23e315g.bunny.run` until 2026-07-07, when a PATCH to the container's Magic
Containers config (updating `OPENROUTER_API_KEY`) omitted the `endpoints` array, which wiped
the existing CDN endpoint instead of leaving it alone. Restoring it minted a brand-new
hostname rather than reviving the old one — **the old hostname is now permanently dead**,
not just stale. If you see `mc-ucz23e315g.bunny.run` referenced anywhere (code, docs, env
vars) that's from before this date and needs updating to the current address below. Lesson
for next time: the Magic Containers API's PATCH endpoint requires the full container
template on every call — omitted fields are NOT preserved, they're cleared.

## Current deployment state (verified live, not assumed)

- **`localplus-api`** (backend): **Bunny Magic Container only now** — `mc-p1bm8gzkgs.b-cdn.net`.
  Its Vercel project/domain (`api.localplus.city`) has been **fully retired**: domain
  unassigned from the Vercel project, the Cloudflare DNS CNAME deleted, and the `deploy`
  npm script neutered (refuses to run, points at `scripts/deploy-to-bkk.sh`). **Do not
  try to deploy `localplus-api` to Vercel — there is no longer a Vercel target for it.**
  **Correction, later same day**: `api.localplus.city` does *not* cleanly fall through to
  the zone's WordPress wildcard for normal traffic, despite there being no DNS record for
  it anymore (confirmed via the Cloudflare API — zero DNS records match that name). There's
  a **stale Cloudflare Worker Route** bound directly to that exact hostname, independent of
  DNS records and taking priority over them — a leftover from an *abandoned* Nov–Dec 2025
  migration attempt to Google Cloud Functions + API Gateway (see
  `localplus-api/google-cloud-functions/`, especially `MIGRATION_GUIDE.md` — that migration
  was never finished; Vercel became the real backend instead, then Bunny). Responses through
  normal Cloudflare routing carry an `x-cloud-trace-context` header (Google Cloud's own trace
  header) and an App-Engine-style 500 page — the Worker is proxying to, or itself sitting on,
  a decayed GCP target. It has likely silently sat in front of `api.localplus.city` through
  all three backend generations (GCF → Vercel → Bunny) without ever being cleaned up.
  Confirmed by bypassing Cloudflare and hitting the WordPress origin IP directly with the
  same Host header — that origin correctly returns the wp-signup.php redirect, proving the
  Worker (not the origin) is what's intercepting normal requests. **Not yet removed** — needs
  a Cloudflare API token scoped with Workers Routes access (none available in that session)
  or a manual dashboard check: zone `localplus.city` → Workers Routes → find/delete the route
  matching `api.localplus.city/*`. Bottom line either way: `api.localplus.city` is unreliable
  in an undefined way right now — don't use it in any client code, and don't trust a single
  test of it (WordPress redirect vs. GCP-flavored error vs. something else) to tell you its
  real state.
- **`localplus-partner`** (partner dashboard): **stays on Vercel** — `partners.localplus.city`,
  21 API routes, works fine on the Hobby plan. This is a decided architectural position,
  not an oversight — see D-001 in `DECISIONS.md`. Do not propose containerizing it onto
  Bunny without first reading that decision.
- **`localplus-admin-dashboard`** (admin UI, repo folder `localplus-admin`): **stays on
  Vercel** too, same reasoning. Its `apiService.ts` already points at the Bunny container
  (`mc-p1bm8gzkgs.b-cdn.net`) for backend calls — fixed same day, independently, by another
  agent.
- **`localplus-mobile`** (the real RN consumer app): `newsService.ts`/`eventsService.ts`
  already point at the Bunny container. Note: this only takes effect on the *next app
  build/release* — already-installed copies of the app keep hitting whatever was baked
  in at their build time.
- **`localplus-consumer`, `LocalPlus v2`**: legacy/stale, still reference the old
  `api.localplus.city` domain in their own env files, but neither is an active production
  target (consumer is already decided-superseded by `localplus-mobile`; `v2`'s last
  commit is ~7 months old). Not a live risk, just dead code.
- **`localplus-super-app`**: separate repo, still defaults to `api.localplus.city` in live
  code, and its actual production status is **unclear** — no matching Vercel project was
  found for it. Unresolved; flag to a human rather than guessing if you touch this repo.

## The shared-secret mechanism (if you touch auth on any of these)

`localplus-api`'s `server.mjs` gates several routes (bookings, businesses, restaurants,
notifications, data-ingest, etc.) behind either a real Supabase user JWT or a shared
secret, `INTERNAL_API_KEY`, for trusted server-to-server callers (`isInternalCall()` in
`server.mjs`, same check duplicated in `events/utils/rbac.js`'s `getAuthenticatedUser`).
That secret must match on **both** the caller's side and the Bunny container's side.

**Trap to avoid**: Vercel env vars created as type `sensitive` (the default for
Production/Preview unless you pass `--no-sensitive`) can **never be read back** — not via
`vercel env pull`, not via the dashboard, not via the API. An empty-looking value from
`vercel env pull` does **not** mean the variable is actually empty; it means the CLI can't
show it. Verify a suspected-broken secret by testing the actual behavior (curl the
endpoint with a known-good value, or trigger the real call path) — never by reading the
var back.

## Governance

- `localplus-partner/DECISIONS.md` — **D-001**: no full Vercel→Bunny migration; if Hobby
  plan limits/ToS ever become a real blocker for `localplus-partner`/`localplus-admin-dashboard`,
  the next step is evaluating Vercel Pro, not containerizing them.
- `localplus-partner/BACKLOG.md` — **BL-003**: the decommission item, closed.
- `localplus-api` has no `DECISIONS.md`/`BACKLOG.md` of its own yet — worth setting up,
  this asymmetry is part of why today's drift happened in the first place.
