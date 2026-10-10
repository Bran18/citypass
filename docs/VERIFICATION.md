# Verification — 2026-10-10

## Passed
- Next.js 16.4.0 production compilation and route generation.
- Strict TypeScript validation.
- 5 Vitest tests: QR origin restrictions, reservation validation, guest consent/time validation, OAuth locale allowlist and dictionary parity.
- 38 SQL assertions running the actual migration in PGlite PostgreSQL. Includes anonymous denial, tenant isolation, merchant exclusion from guest data, self-escalation denial, invitation hashing/expiry/replay/rotation/attempt lockout/cancellation, hotel review transitions, passport ownership, duplicate claims, QR limits/expiry/revocation, persistent claim throttling, all-table RLS and ledger immutability.
- HTTP 200 from local production discovery route.
- In-app browser visual checks at 390×844 and 1440×1000.
- In-app browser: English discovery, category filtering, source attribution, Portuguese passport with zero fabricated stamps, disabled unconfigured Google button, language navigation back to Spanish, matching document language, no horizontal overflow at 390px, guest fragment removal and client validation for empty fields/consent.

## Blocked or not yet verified
- The standalone Playwright runner attempted 10 desktop/mobile cases but Chromium was blocked at process launch by macOS sandbox MachPortRendezvous permissions. This is NOT a passing automated E2E result. Tests remain checked in for execution in a compatible host or CI.
- No live Supabase project was selected or modified. No Google OAuth credentials were fabricated. SSR refresh behavior and PostgREST integration are implemented but not verified against a hosted service.
- PGlite uses minimal auth.users/auth.uid fixtures. It does not test Supabase Auth, network requests or independent concurrent database connections.
- Staff/guest flows were verified at the SQL layer, not end-to-end with real accounts.
- Physical camera scanning, screen-reader testing, mobile device matrix, hosted security advisors and load tests are pending.

See PILOT_PLAN.md for release gates. The app is not marked pilot-ready or production-ready.

## UI and Three.js refinement

Added Three.js 0.186.1 as a lazy scene module, with TypeScript definitions 0.186.0. Original geometry and shader water use no downloaded media. Desktop browser rendered the scene with no graphics errors; pause/resume and close-view controls were exercised. Sample-stamp preview and reset worked and did not award a real stamp. English mobile layout at 390px had no horizontal overflow. Desktop review at 1440px led to corrected cliff occlusion, lighter foliage, better camera framing and removal of the overlapping decorative caption.

TypeScript, production build, 5 validation tests and 38 database assertions passed after the UI implementation. Added Playwright cases for sample/reset, reduced-motion default, WebGL failure fallback and canvas cleanup on navigation. The updated 18-case suite was attempted with one worker and stopped at the first Chromium-launch sandbox failure; the remaining 17 did not run. Reduced-motion and forced WebGL-failure automated tests are present but not claimed as executed successfully on this host. In-app checks verify the normal rendering path and controls.

The development watcher also encountered a macOS FSEvent restriction. Production build/start was used for local preview. No live Supabase configuration or deployment changed.

## Passport collectible revision

Restored the original discovery illustration, added an opening passport, a temporary Three.js stamp press and a clickable sample waterfall stamp. Real collected records now open name/date details. Verified in the in-app browser: open passport, press stamp, open detail, pause, close-up, Escape, restored trigger focus, zero canvases after dismissal, and zero collected stamps after trying the sample. Reviewed the detail at a 390px viewport with no horizontal overflow.

Typecheck, 5 unit tests, 38 embedded PostgreSQL assertions and `npm run build -- --webpack` passed. Default Turbopack build was blocked by sandbox port binding. Playwright was attempted but macOS denied Chromium MachPortRendezvous launch; no automated browser assertions executed. Reduced-motion and WebGL-fallback cases are specified in the updated suite but not newly browser-verified. Hosted Supabase remains unconfigured.

## Visit Iguazú directory expansion

15 curated entries: 9 attractions/experiences and 6 agencies. Typecheck, 8 unit tests, 38 embedded database assertions and the Webpack production build passed. New unit coverage validates attribution, language completeness, exclusion of municipal footer contacts, accent-insensitive combined filtering, and database precedence without directory promotion. The browser suite was attempted; Chromium launch remained blocked by macOS sandbox permissions before assertions ran.

In-app browser verified agency filtering, Aguas Grandes contact disclosure, correct mailto/tel and source URLs, and a search for `entre rios` returning one agency while retaining the category. Mobile 390px review showed no horizontal page overflow. Source dates represent directory review, not direct operator confirmation. Hosted Supabase integration remains pending; no new database writes or migrations were performed.

## Routes page
Typecheck, 10 unit tests, 38 embedded database assertions and Webpack production build passed. Itinerary tests verify source-backed stop resolution and safe fallback for unknown routes. Playwright suite attempted but Chromium launch blocked by macOS before assertions. In-app browser verified route selection, two wildlife stops, bookmark persistence across reload and removal, desktop 1440px layout, and Portuguese roots route at 390px with no horizontal overflow. No real claims, bookings or route awards were generated. Browser storage failure has a visible fallback message; that branch was not manually exercised.

## Rewards preview
TypeScript, 10 unit tests, 38 embedded SQL assertions and the Webpack production build passed. Added a Playwright scenario for interest persistence, filtering, removal and accurate unavailable-reward messaging. The automated browser suite was attempted but Chromium launch remained blocked by macOS before assertions ran. In-app browser verified saved interest across reload, saved-only filtering, removal to the empty state, English FAQ disclosure, and layouts at 1440px and 390px with no horizontal overflow. Storage failure messaging exists but was not manually exercised. No offers, coupons, points or redemption functionality is live.

## Connected Iguapass verification — 2026-10-10

Supersedes earlier unconfigured-preview status. The hosted schema and 15 sourced listings are installed; generated database types are integrated. Google OAuth, passport activation and refresh persistence passed in the browser. Typecheck, 10 unit tests, 38 embedded database assertions and a configured production build passed. Hosted transactional workflow/RLS tests passed and rolled back their fixtures. See [database connection report](DATABASE_CONNECTION.md) for reproducible checks, advisor findings and remaining pilot gates.
