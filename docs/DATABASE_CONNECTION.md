# Iguapass database connection

Verified 2026-10-10. Project: `Iguapass`, ref `wafunogjrczlwvdnvyfs`, region `us-east-2`.

Rechecked 2026-10-13 through both the Supabase plugin and project-scoped MCP: both identify the configured Iguapass project, which is active and healthy. Hosted migration history still matches the three local files. `npm run test:connected` passed against the configured URL and publishable key, verifying Google Auth, public catalog access and anonymous private-data denials. No remote writes or application configuration changes were required.

The current security advisor also reports a warning for disabled leaked-password protection, in addition to the four intentional private-table default-deny INFO findings. The app uses Google OAuth; review password protection before enabling password authentication. Earlier advisor results below describe the original verification, not the current warning state.

## Applied remotely

Three checked-in migrations match hosted migration history:

- `20261010183147_foundation.sql`: 12 public and 4 private tables, RLS, explicit privileges and validated command functions.
- `20261010183213_catalog_provenance.sql`: stable catalog identity, review date and public contact fields.
- `20261010183630_foreign_key_indexes.sql`: covering indexes for advisor-identified foreign keys.

`supabase/seed.sql` populated Puerto Iguazú and 15 attributed listings (9 attractions/experiences and 6 agencies). All listings remain `listed`; none is an approved partner. No redeemable stamps or rewards were fabricated.

The app uses generated database types and a request-scoped Supabase SSR client. `.env.local` contains only the project URL, public publishable key and local app origin; it is git-ignored. No service-role key is used.

## Authentication

Google is enabled; anonymous sign-ins are disabled. Site URL is `http://127.0.0.1:3000`. The exact allowed redirects are `/auth/callback?locale=es`, `/auth/callback?locale=en` and `/auth/callback?locale=pt` on that origin. Real Google sign-in, callback, passport activation and persistence after refresh passed in the local browser. That activation created a real passport with no stamp claims.

Before deployment, configure the actual origin and corresponding Auth redirects. No web deployment was performed.

## Verification

- TypeScript check, 10 unit tests, 38 embedded PostgreSQL assertions and production Webpack build passed.
- `npm run test:connected` checks live Auth settings, readable sourced listings, anonymous private-data denials and the unexposed private schema. It performs no writes.
- `scripts/verify-hosted.sql` passed against hosted PostgreSQL: account isolation, hotel onboarding/reservations, guest invitations and replay protection, review transitions, authorized QR claims and duplicate denial. Fixtures and writes were rolled back, and absence of fixture users was checked afterward. This SQL test sets database roles/JWT claims; it does not replace real multi-user browser tests.
- All 16 application tables have RLS enabled. The security advisor returned no warnings or errors. Four private-table INFO findings report RLS without policies: intentional default-deny access, mediated by validated functions. See [RLS without policies](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- Foreign-key index findings were resolved. Remaining performance INFO findings are fresh unused indexes and Auth's fixed connection allowance. See [unused indexes](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index) and [production guidance](https://supabase.com/docs/guides/deployment/going-into-prod).

## Remaining pilot work

Independent-connection concurrency tests and full guest/staff browser workflows remain pending. Standalone Playwright Chromium has been blocked by this environment's Mach-port sandbox restriction; in-app browser checks supplement it. Obtain actual business approvals before issuing real stamps. Rewards redemption, automatic route awards, account-synced itinerary bookmarks/interests and automated data-retention jobs remain planned. This connection is not a claim of production readiness.
