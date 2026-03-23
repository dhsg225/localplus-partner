# LocalPlus Partner App - RESTART Guide

**Recent Activity Log:**

- **[Jan 15, 2025 - 14:30 +07]** Started development server on port 9003 - server was not running, causing ERR_CONNECTION_REFUSED error when accessing localhost:9003. Verified port configuration in vite.config.ts and package.json, then started dev server successfully. Server now listening on port 9003.

- **[Dec 08, 2025 - 16:55 +07]** Investigated Sandy account SQL fix; added complete Supabase SQL script and identified permissions column type mismatch (jsonb vs text[]); preparing corrected INSERT casting. Continued guidance for Admin Panel/SQL remediation for partner record creation.

**[Dec 06, 2025 - 17:59 +07]** 🔧 **REGISTRATION ENDPOINT FIX & ADMIN PANEL IMPROVEMENTS**: Fixed critical registration endpoint issue - converted `auth/register/route.js` from CommonJS to ES modules to resolve `FUNCTION_INVOCATION_FAILED` error (package.json has `"type": "module"`). Deployed to Vercel successfully. Updated Cloudflare Worker with new Vercel deployment URL. Added auto-refresh to AdminUsers page (refreshes every 30 seconds) to catch new registrations. Improved error handling in registration endpoint to detect and warn about partner record creation failures. Current issue: New users not appearing in admin panel - likely due to partner record creation failing silently (possibly RLS policies). Registration endpoint now working, but partner linking needs investigation.


- **[Dec 23, 2025 - 19:28 +07]** Reviewed new request to fetch Category/Location/Organizer from DB with autocomplete; noted server-side search for events was added and deployed earlier; planning next step to wire dropdowns to Supabase data sources and typeahead service.
- **[Dec 23, 2025 - 19:28 +07]** Implemented autocomplete dropdowns for Category, Location, and Organizer in CreateEventModal - Added search support to API endpoints (organizers, locations, categories) with debounced typing, created new categories API endpoint from wp_term_mapping table, updated CreateEventModal with autocomplete inputs that show dropdown suggestions as user types.
- **[Dec 23, 2025 - 19:28 +07]** Fixed CORS for event detail endpoint by allowing custom auth headers (x-user-token, x-supabase-token, x-original-authorization) on /api/events/[id]; committed and pushed.
- **[Dec 23, 2025 - 19:28 +07]** Bumped UI version label to v0.2.02; aligned CORS headers on organizers/locations/categories endpoints.
- **[Dec 23, 2025 - 19:28 +07]** Created organizers table migration and applied via psql; CORS aligned on organizers/locations/categories; UI version label v0.2.02 committed.
- **[Dec 23, 2025 - 19:28 +07]** Improved OPTIONS preflight handler in events/[id] endpoint - added Access-Control-Max-Age and explicit JSON response; committed and pushed.
- **[Dec 23, 2025 - 19:28 +07]** Fixed OPTIONS handler in events/[id] - changed from .json({}) to .end() to match other endpoints pattern; this should resolve the 500 error on preflight requests.
- **[Dec 23, 2025 - 19:28 +07]** Added error handling to OPTIONS handler in events/[id] endpoint; auto-incremented version to v0.2.03; committed and pushed both changes.