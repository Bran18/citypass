# Implementation plan and honest status

## First working source milestone
- [x] New project directory, pinned dependencies, strict TypeScript, App Router and design primitives.
- [x] Architecture, requirements, source provenance, privacy assumptions and engineering conventions.
- [x] Normalized destination/organization/passport/hotel schema, RLS and explicit privileges.
- [x] Spanish/English/Portuguese interface dictionaries and locale-aware dates.
- [x] SSR Google OAuth code, refresh proxy, callback allowlist and sign-out.
- [x] Public discovery, passport activation/history and empty states.
- [x] Visit QR issue/revoke/claim with transactional duplicate/capacity controls and persistent rate limits.
- [x] Hotel onboarding, reservations, invitation generation, guest form and review transitions.
- [x] Database authorization and replay tests against embedded PostgreSQL.
- [x] Connect the user-selected Iguapass project and apply migrations and catalog seed.
- [x] Configure callback URLs and verify real Google sign-in, passport activation and refresh persistence.
- [ ] Complete separate guest/staff browser workflows with authorized pilot identities.
- [x] Generate and integrate database types from the selected Supabase project.
- [x] Hosted Auth settings, REST denials, transactional RLS/workflow checks and security advisor review.
- [ ] Independent-connection concurrency tests.

The milestone is not declared complete until the live flows above are verified. No mock backend is substituted.

## Next slices, in dependency order
1. Connected milestone: project configuration, real tourist/hotel identities, partner approval and first authorized QR enrollment; verify complete flows.
2. Partner operations: owner-managed staff invitations/revocation, admin permissions and approval UI, guest guide, configurable fields, imports, secure invitation sessions for opened/in_progress tracking.
3. Exploration: enroll three curated routes, add provenance-aware content ingestion, route completion transactions and achievement definitions.
4. Merchant loyalty: verified purchase RPC, versioned earning rules, immutable ledger and merchant-funded reward consumption. Keep disabled until settlement/funding rules and concurrency checks pass.
5. Operator experiences: operator profiles, multilingual listings, external booking links, unconfirmed booking inquiries and manual response workflow.
6. Pilot readiness: edge throttles, privacy notices and retention jobs, backups, support, mobile camera matrix, accessibility and performance checks. Explicit deployment approval required.

### Curated Visit Iguazú directory
Implemented: 15 attributed discovery records (9 attractions/experiences, 6 agencies), multilingual original summaries, public contacts, source review dates, category filtering and accent-insensitive search. This is a manually reviewed snapshot; automatic synchronization, photo reuse, operator confirmation and official affiliation are not implemented or implied. The editorial directory supplements successful database queries, with database identity matches taking precedence. See SOURCES.md for exact coverage.

### Routes discovery
Four editorial itinerary suggestions now cover park circuits, wildlife, culture/rural visits and adventure. Each includes ordered source-linked stops, location-search links, preparation notes and agency discovery. Route selection has a stable URL; browser-local bookmarks persist across reloads and are clearly separate from stamps. Existing database route/claim rendering is retained when configured. Suggestions are not official tours, confirmed bookings, mapped directions or route awards. Hosted route progress verification remains pending.

### Rewards discovery preview
Implemented a clearly labeled upcoming-program page with three benefit concepts, browser-local interest saving/removal and filtering, future redemption explanation and FAQs in ES/EN/PT. These are proposed categories, not live merchant offers. Interests are not transmitted, synced with accounts, used as waitlist registrations or converted into bookings. No points, ledger writes, claims or redemption APIs were added. Actual reward funding, program rules and transactional redemption remain Phase 4 work.
