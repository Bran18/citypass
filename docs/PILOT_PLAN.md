# Pilot plan and release gates

Controlled validation targets: 2 hotels, 5 merchants, 2 tour operators, 3 routes, 100 tourist registrations. These are validation targets only. No existing destination listing is an enrolled partner.

## Before inviting tourists
- Select a dedicated Supabase development project; apply migration and seed, confirm API exposure of public only, run advisors.
- Configure Google OAuth, exact callback URLs, authorized app domains and privacy policy. Test on an actual phone.
- Approve only contracted/consenting businesses. Register membership through verified identities. Create venue/stamp rows for those partners; seed attractions stay listed, not participating.
- Run hosted RLS tests with tourist A/B, hotel A/B, receptionist and merchant identities. Test staff revocation and sign-out.
- Run independent Postgres connections competing for the same QR cap and stamp; verify one outcome, exact counter and audit count. Repeat after QR rotation.
- Verify invitation reissue, expiry, five wrong emails, replay, cancellation and concurrent submission/review. Check proxy/CDN logs exclude sensitive tokens and POST bodies.
- Add edge abuse limits for public RPC traffic, monitoring, backup/restore drill, incident response and support contacts.
- Obtain local legal review of guest registration requirements, privacy notices, consent and retention. Schedule and verify deletion only after approval of the policy.
- Finish keyboard, screen reader and mobile camera validation on iOS/Android. Validate camera-denied fallback.

## Measurement and feedback
Collect aggregates from actual DB events: activated passports, unique claims, submitted/reviewed hotel forms. Estimate reception minutes saved through consented before/after staff observations. Do not label scans as sales. Later merchant and inquiry metrics must distinguish visits, verified purchases and confirmed bookings. No advertising trackers are installed.

## Go/no-go
This source milestone is not cleared for a real tourist pilot. Live Auth/REST validation, provider credentials, operational enrollment, concurrency across independent connections and legal/privacy work remain gates. Production deployment requires approval.
