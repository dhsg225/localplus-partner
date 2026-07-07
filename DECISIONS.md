# Architecture Decisions

Stable decisions that should not be re-litigated without explicit human input.

Format:
- **Decision**: The choice made.
- **Rationale**: Why this choice was made.
- **Implication**: What agents must do (or not do) as a result.
- **Status**: Active | Superseded | Needs Human

---

## D-001 — Do not do a full Vercel-to-Bunny migration; finish the API decommission properly instead

**Decision**: We are **not** moving `localplus-partner` or `localplus-admin-dashboard` off Vercel onto Bunny Magic Containers. For `localplus-api`, the work is not "done" just because a Bunny container exists — its Vercel deployment must be properly decommissioned (clients repointed and verified) rather than assumed dead.

**Rationale**: Verified live on 2026-07-06, not assumed:
- Vercel team (`team_kwEbVZKrdseHF3acFmS34Wty`) is still on the **Hobby plan**.
- `localplus-partner` is a live, working Vercel deployment today (`partners.localplus.city`) with **21 API routes** — well past the ~12-serverless-function Hobby cap that justified moving `localplus-api` — yet it isn't blocked. That cap does not appear to constrain Next.js App Router deployments the way it constrained `localplus-api`'s bare-function file layout. `localplus-admin-dashboard` is likewise live and unaffected.
- `localplus-api` still has an **active** Vercel deployment (`api.localplus.city`, redeployed within the hour of checking) in addition to its Bunny container (`mc-p1bm8gzkgs.b-cdn.net`) — the Vercel side was never retired.
- `localplus-mobile` (`newsService.ts`, `eventsService.ts`) and `localplus-admin` (`apiService.ts`) were initially believed to still call `api.localplus.city` directly — **re-checked same session, that was a false read** (grep matched an explanatory comment, not the live constant). Both already default to the Bunny container; both repos' own most recent commits today independently confirm the same repoint. Still, `api.localplus.city`'s Vercel project/DNS should not be deleted without one real end-to-end smoke-test of each client against Bunny first, per BL-003.
- The actual live constraint on Hobby for `localplus-partner`/`localplus-admin-dashboard` is Vercel's **commercial-use ToS restriction** (this is a paying-customer SaaS product), not a function-count wall — the fix for that is upgrading to Pro, not containerizing two full SSR apps onto infrastructure built for backend containers.
- This whole question surfaced because of a real incident (`INCIDENT_2026-07-06_internal-api-key.md`) caused by two agents holding different beliefs about what was actually deployed where — the audit here is the correction.

**Implication**: Agents must not assume `localplus-api`'s Vercel deployment is inert, and must not treat "the Bunny container exists" as equivalent to "the Vercel migration is complete." Before touching `localplus-api`'s Vercel project or `api.localplus.city` DNS: audit exactly which endpoints `localplus-mobile` and `localplus-admin` still call there, confirm parity on the Bunny container, repoint those two clients, verify in the field, **then** retire the Vercel project/domain. Agents must not propose or start containerizing `localplus-partner` or `localplus-admin-dashboard` onto Bunny without a new decision superseding this one — if Hobby-plan limits/ToS become a blocker, the next step is evaluating Vercel Pro, not migration.

**Status**: Active

---
