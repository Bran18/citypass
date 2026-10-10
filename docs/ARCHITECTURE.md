# Architecture

## First milestone
A modular Next.js App Router application serves public discovery and authenticated passport / hotel portals. Supabase Auth handles Google OAuth using PKCE and SSR cookies. PostgreSQL is the source of truth. The initial destination is data, not a domain constant. Every passport, venue, route and organization belongs to a destination.

Browser → server components / server actions → user-scoped Supabase client → RLS or narrow PostgreSQL RPC → private transactional implementation.

Public listing data is intentionally separated from organization membership, invitation credentials and hotel guest submissions. No service-role client is needed in the application. Private schema functions provide tightly scoped mutation capabilities; public wrappers are invoker functions with explicit EXECUTE grants. Authenticated operations derive the user from auth.uid(), never request arguments. Anonymous pre-check-in is an intentional capability exception requiring a 256-bit invitation token and matching reservation email.

Stamp collection locks credential rows and user rate-limit rows, checks approved participation, expiration, revocation, destination, capacity and prior claims, then inserts a claim and audit event atomically. A static QR records a low-value visit, not a sale or proof of physical presence.

Hotel onboarding atomically creates an organization and owner membership. Reservations are scoped to that organization. Secure invitations return a raw secret only once; the database stores its SHA-256 hash. Invitations expire after 72 hours or checkout, whichever comes first, and are consumed on submission. Guest forms never read reservation PII; the token plus matching email authorizes a write only. Reissuing invalidates earlier links.

Discovery works without credentials from a small curated source catalog. Personal actions fail closed until configured. Connected discovery reads public venue records; a failed query is an error rather than fallback to fake live data.

## Stack and boundaries
Next.js / React / TypeScript strict; Tailwind 4; shadcn-style owned UI primitives; Lucide; next-intl messages for Spanish, English and Portuguese; React Hook Form + Zod on guest form. Server actions eliminate the need for TanStack Query in this milestone. No upload functionality or Storage bucket until needed. PGlite executes migration and authorization tests locally; Supabase Auth and PostgREST still require live integration verification.

## Later modules
Merchant earning and reward redemption must use immutable ledger entries, explicit funding organizations, idempotency references and database locks. Do not expose these planned modules as working transactions. Booking inquiries remain unconfirmed requests. See IMPLEMENTATION_PLAN.md.

## Design plan
Colors: canopy #163e35, river #216779, mist #edf3f1, paper #fbfcf8, pollen #e9c86b, ink #173b34. Georgia display type evokes a travel journal; system sans keeps forms legible and offline-safe. Main discovery uses a split editorial hero with a custom waterfall illustration and a physical-passport motif; place lists use open rows, not repeated dashboard tiles. Mobile bottom navigation prioritizes exploration and the passport. Hotel portal uses restrained tabular arrival information. Alignment is left, except passport seals. Reduced motion and visible keyboard focus are required.

Reviewed against brief: no SaaS gradient hero, fabricated activity counters or default commerce cards. The characteristic object is the passport and the landscape it records.

## Official references reviewed 2026-10-10
- https://nextjs.org/docs/app/getting-started/installation
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://ui.shadcn.com/docs/installation/next
- https://supabase.com/changelog.md
- https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes (new schema uses no affected legacy encryption, ltree, btree_gist or custom operators).
