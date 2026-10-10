import { PGlite } from '@electric-sql/pglite';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const db = new PGlite();
let checks = 0;
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const admin = async () =>
  db.exec("reset role; select set_config('request.jwt.claim.sub','',false)");
const as = async (id: string | null) => {
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id ?? '']);
  await db.exec(`set role ${id ? 'authenticated' : 'anon'}`);
};
const check = (condition: unknown, name: string) => {
  assert.ok(condition, name);
  checks++;
  console.log(`✓ ${name}`);
};
const rpc = async (action: string, payload: object) => {
  const { rows } = await db.query<{ r: Record<string, unknown> }>(
    'select public.passport_command($1,$2::jsonb) as r',
    [action, JSON.stringify(payload)],
  );
  return rows[0].r;
};
const denied = async (sql: string) => {
  try {
    await db.exec(sql);
    return false;
  } catch {
    return true;
  }
};
try {
  await db.exec(
    `create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`,
  );
  for (const file of (await readdir('supabase/migrations')).sort())
    await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'));
  await db.exec(await readFile('supabase/seed.sql', 'utf8'));
  const owner = '30000000-0000-4000-8000-000000000001',
    other = '30000000-0000-4000-8000-000000000002',
    tourist = '30000000-0000-4000-8000-000000000003',
    tourist2 = '30000000-0000-4000-8000-000000000004',
    merchant = '30000000-0000-4000-8000-000000000005';
  const dest = '10000000-0000-4000-8000-000000000001';
  for (const id of [owner, other, tourist, tourist2, merchant])
    await db.query('insert into auth.users values($1)', [id]);
  await as(null);
  check(
    (await rpc('create_hotel', { name: 'Unauthorized', destination_id: dest })).error ===
      'unauthorized',
    'anonymous cannot onboard a hotel',
  );
  check(
    await denied('select * from public.hotel_reservations'),
    'anonymous cannot read reservations',
  );
  await as(owner);
  const org = (await rpc('create_hotel', { name: 'Pilot Hotel', destination_id: dest }))
    .id as string;
  check(Boolean(org), 'owner onboarding persists organization and membership');
  const arrival = new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    departure = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const reservation = (
    await rpc('create_reservation', {
      organization_id: org,
      reference: 'PILOT-01',
      email: 'Guest@example.com',
      arrival,
      departure,
      guest_count: 2,
    })
  ).id as string;
  check(Boolean(reservation), 'hotel creates real reservation');
  const secret = 'a'.repeat(64);
  check(
    (await rpc('issue_invitation', { reservation_id: reservation, token: secret })).ok,
    'hotel issues invitation',
  );
  await as(other);
  check(
    (await db.query('select * from public.hotel_reservations')).rows.length === 0,
    'other hotel user cannot read reservation',
  );
  check(
    (await rpc('issue_invitation', { reservation_id: reservation, token: 'b'.repeat(64) }))
      .error === 'forbidden',
    'other user cannot issue invitation',
  );
  check(
    await denied(`insert into public.organization_members values('${org}','${other}','owner')`),
    'user cannot grant themselves ownership',
  );
  await admin();
  await db.query("insert into public.organization_members values($1,$2,'merchant')", [
    org,
    merchant,
  ]);
  await as(merchant);
  check(
    (await db.query('select * from public.hotel_reservations')).rows.length === 0,
    'merchant membership does not confer guest access',
  );
  await as(null);
  const guest = {
    token: secret,
    email: 'guest@example.com',
    full_name: 'Test Guest',
    phone: '123456',
    nationality: 'Argentina',
    residence: 'Argentina',
    arrival_time: '14:30',
    requests: '',
    consent: true,
  };
  check(
    (await rpc('submit_precheckin', { ...guest, email: 'wrong@example.com' })).error ===
      'invalid_invitation',
    'invitation requires matching reservation email',
  );
  check(
    (await rpc('submit_precheckin', guest)).ok,
    'anonymous guest submits with valid capability',
  );
  check(
    (await rpc('submit_precheckin', guest)).error === 'invalid_invitation',
    'consumed invitation rejects replay',
  );
  await as(owner);
  check(
    (await db.query('select * from public.precheckin_submissions')).rows.length === 1,
    'own hotel reads submission',
  );
  check(
    (await rpc('review_reservation', { reservation_id: reservation, status: 'completed' }))
      .error === 'invalid_state',
    'cannot skip review states',
  );
  check(
    (await rpc('review_reservation', { reservation_id: reservation, status: 'reviewed' })).ok,
    'hotel reviews submission',
  );
  await as(other);
  check(
    (await db.query('select * from public.precheckin_submissions')).rows.length === 0,
    'cross-tenant guest data remains hidden',
  );
  await admin();
  const invitation = (
    await db.query<{ token_hash: string }>('select token_hash from private.precheckin_invitations')
  ).rows[0];
  check(
    invitation.token_hash === hash(secret) && invitation.token_hash !== secret,
    'only hashed invitation token is stored',
  );
  await db.query("update public.organizations set status='approved' where id=$1", [org]);
  const venue = '20000000-0000-4000-8000-000000000001',
    stamp = '40000000-0000-4000-8000-000000000001';
  await db.query(
    "update public.venues set organization_id=$1,participation_status='participating' where id=$2",
    [org, venue],
  );
  await db.query(
    "insert into public.stamp_definitions(id,venue_id,destination_id,name) values($1,$2,$3,'Pilot stamp')",
    [stamp, venue, dest],
  );
  const qr = 'c'.repeat(64);
  await as(owner);
  check(
    (await rpc('issue_qr', { stamp_id: stamp, token: qr })).ok,
    'approved venue owner issues QR',
  );
  await as(tourist);
  check(
    (await rpc('claim_stamp', { token: qr })).error === 'activate_first',
    'claim requires destination passport',
  );
  const passport = (await rpc('activate_passport', { destination_id: dest })).id as string;
  check(Boolean((await rpc('claim_stamp', { token: qr })).id), 'authorized claim persists stamp');
  check(
    (await rpc('claim_stamp', { token: qr })).error === 'already_claimed',
    'duplicate claim is rejected',
  );
  check(
    await denied(
      `insert into public.stamp_claims(passport_id,stamp_id,destination_id,credential_id) select '${passport}','${stamp}','${dest}',id from private.qr_credentials`,
    ),
    'direct claim injection denied',
  );
  check(
    (await db.query('select * from public.stamp_claims')).rows.length === 1,
    'tourist sees own stamp',
  );
  await as(tourist2);
  await rpc('activate_passport', { destination_id: dest });
  check(
    (await db.query('select * from public.stamp_claims')).rows.length === 0,
    'tourist cannot see another passport history',
  );
  await admin();
  await db.exec('update private.qr_credentials set max_claims=1');
  await as(tourist2);
  check((await rpc('claim_stamp', { token: qr })).error === 'limit', 'global capacity enforced');
  await admin();
  await db.exec(
    "update private.qr_credentials set max_claims=100,expires_at=now()-interval '1 second'",
  );
  await as(tourist2);
  check((await rpc('claim_stamp', { token: qr })).error === 'invalid_qr', 'expired QR denied');
  await admin();
  await db.exec("update private.qr_credentials set expires_at=now()+interval '1 day'");
  await as(owner);
  await rpc('revoke_qr', { stamp_id: stamp });
  await as(tourist2);
  check((await rpc('claim_stamp', { token: qr })).error === 'invalid_qr', 'revoked QR denied');
  for (let i = 0; i < 10; i++) await rpc('claim_stamp', { token: '0'.repeat(64) });
  check(
    (await rpc('claim_stamp', { token: qr })).error === 'rate_limit',
    'failed claims consume persistent rate-limit budget',
  );
  await admin();
  const rls = await db.query<{ relname: string }>(
    "select relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname in ('public','private') and c.relkind='r' and not c.relrowsecurity",
  );
  check(rls.rows.length === 0, 'every application table has RLS');
  await as(owner);
  check(
    await denied('update public.points_ledger set delta=999'),
    'client cannot mutate points ledger',
  );
  await as(owner);
  const r2 = (
    await rpc('create_reservation', {
      organization_id: org,
      reference: 'PILOT-02',
      email: 'guest@example.com',
      arrival,
      departure,
      guest_count: 1,
    })
  ).id;
  const oldToken = 'd'.repeat(64),
    newToken = 'e'.repeat(64);
  await rpc('issue_invitation', { reservation_id: r2, token: oldToken });
  await rpc('issue_invitation', { reservation_id: r2, token: newToken });
  await as(null);
  check(
    (await rpc('submit_precheckin', { ...guest, token: oldToken })).error === 'invalid_invitation',
    'reissue invalidates old link',
  );
  for (let i = 0; i < 5; i++)
    await rpc('submit_precheckin', { ...guest, token: newToken, email: 'wrong@example.com' });
  check(
    (await rpc('submit_precheckin', { ...guest, token: newToken })).error === 'invalid_invitation',
    'five wrong email attempts lock invitation',
  );
  await as(owner);
  await rpc('issue_invitation', { reservation_id: r2, token: 'f'.repeat(64) });
  await admin();
  await db.query(
    "update private.precheckin_invitations set expires_at=now()-interval '1 second' where reservation_id=$1",
    [r2],
  );
  await as(null);
  check(
    (await rpc('submit_precheckin', { ...guest, token: 'f'.repeat(64) })).error ===
      'invalid_invitation',
    'expired invitation cannot submit',
  );
  await as(owner);
  await rpc('issue_invitation', { reservation_id: r2, token: '9'.repeat(64) });
  await rpc('review_reservation', { reservation_id: r2, status: 'cancelled' });
  await as(null);
  check(
    (await rpc('submit_precheckin', { ...guest, token: '9'.repeat(64) })).error ===
      'invalid_invitation',
    'cancelled reservation rejects guest submission',
  );
  await as(owner);
  check(
    (await rpc('review_reservation', { reservation_id: reservation, status: 'ready_for_arrival' }))
      .ok,
    'reviewed reservation becomes ready',
  );
  check(
    (await rpc('review_reservation', { reservation_id: reservation, status: 'completed' })).ok,
    'ready reservation completes',
  );
  await admin();
  await db.query(
    "insert into public.points_ledger(passport_id,funding_organization_id,delta,kind,transaction_reference) values($1,$2,10,'earned','test-only')",
    [passport, org],
  );
  check(
    await denied('update public.points_ledger set delta=20'),
    'ledger rejects privileged updates as well',
  );
  await db.query("update public.organizations set status='pending' where id=$1", [org]);
  await as(owner);
  check(
    (await rpc('issue_qr', { stamp_id: stamp, token: '8'.repeat(64) })).error === 'forbidden',
    'unapproved partner cannot issue QR',
  );
  console.log(`\n${checks} database assertions passed (embedded PostgreSQL; not hosted Supabase).`);
} finally {
  await db.close();
}
