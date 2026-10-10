# Authorization

| Resource / operation | Public | Tourist | Hotel staff | Other organization |
|---|---|---|---|---|
| Published destination content | Read | Read | Read | Read |
| Passport, stamp history, points | No | Own only | Own tourist identity only | No |
| Hotel reservation/submission | No | No | Assigned organization and allowed role | No |
| Hotel onboarding | No | Create owned pending hotel | Create owned pending hotel | No access to existing tenants |
| Guest submission | Valid capability + reservation email | Same capability | Same capability | No privileged bypass |
| QR generation | No | No | Approved venue owner/manager | No |
| Stamp claim | No | Own active passport | Own active passport | No cross-user claims |

Membership is a database row. Do not authorize with raw_user_meta_data, a supplied user_id, local storage, UI state or a hidden field. Every RPC validates the target organization from the actual resource. RLS prevents direct reads across tenants. No application service-role client exists.

Google OAuth uses SSR PKCE cookies. Proxy calls getClaims to refresh tokens; sensitive server actions also call getUser. Callback locale is an allowlist, and its redirect origin comes from APP_ORIGIN rather than an attacker-controlled next parameter. Server actions provide Next.js origin checks; RPC authorization remains mandatory because clients can call PostgREST directly.

The public RPC is a security-invoker wrapper. Its private definer implementation deliberately bypasses RLS only after operation-specific checks. Both function grants are explicit; private schema is NOT an exposed API schema. Anonymous access is limited in the dispatcher to guest submission. No member/approval API is exposed yet.

Before pilot: add staff invitation/revocation UX, administrator role table and admin audit viewer; verify current-session revocation behavior with Supabase, MFA policy for staff, project advisors and every policy using distinct real sessions. Suspension policy and emergency staff access must be agreed with operators.
