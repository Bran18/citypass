# Iguazú Passport product requirements

One passport. Your entire Iguazú experience.

## Audience and proposition
Tourists discover a destination publicly, then optionally activate an account to save verified visit stamps. Hotels reduce repeated arrival data entry. Merchants and tour operators eventually participate in verified loyalty and inquiry workflows. This is a shared tourism companion, not a property management system or a directory alone.

## First milestone acceptance
Tourist: public browsing → Google sign-in → destination passport activation → authorized venue QR → atomic claim → persistent stamp history.
Hotel: sign-in → own hotel organization → reservation with reference/email/dates → expiring invitation → guest submission without passport registration → authorized staff review.

Google sign-in, Supabase REST integration, project configuration and independent-session concurrency must be verified before this milestone is declared complete. The local preview and embedded SQL tests alone do not meet that definition.

## Roles
Tourist owns passport history. Hotel owner/manager/receptionist accesses its hotel guest operations. Merchant cannot read hotel records, even when attached to the same organization with the merchant role. Operator workflows and platform admin UI are later scope. Initial partner approval and member provisioning require trusted database administration, never user metadata or frontend role toggles.

## Non-goals
No payments, real-time tour inventory, room keys, compulsory installation, document photo collection, unrestricted cross-merchant monetary settlement or claims of legal compliance.

## Content
Visit Iguazú is a discovery reference. No listing is presumed to be a partner. Preserve source URLs, review date, provenance and licensing decisions. Keep mutable prices and schedules at the source until a verified update process exists.

## Measurement
Controlled targets: 2 hotels, 5 merchants, 2 operators, 3 routes, 100 registrations. Measure activation, unique claims, completed routes, merchant-verified activity, redemptions, pre-check-in completion, observed reception minutes saved and unconfirmed tour inquiries. Targets are hypotheses, not forecasts.
