import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Leaf, Stamp, ScanLine } from 'lucide-react';
import { session, createClient } from '@/lib/supabase/server';
import { destinationId } from '@/lib/catalog';
import { checked } from '@/lib/data';
import { AuthGate } from '@/components/auth-gate';
import { ActionForm } from '@/components/action-form';
import { StampDetail } from '@/components/experience/stamp-detail';
import { PassportPreview } from '@/components/experience/passport-preview';
import { Button } from '@/components/ui/button';
export default async function Passport({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [t, user] = await Promise.all([getTranslations(), session()]);
  const db = user ? await createClient() : null;
  const passports = db
    ? checked(
        await db
          .from('passport_profiles')
          .select('id,created_at')
          .eq('destination_id', destinationId),
      )
    : [];
  const passport = passports[0];
  const claims =
    db && passport
      ? checked(
          await db
            .from('stamp_claims')
            .select('id,claimed_at,stamp_definitions(name)')
            .eq('passport_id', passport.id)
            .order('claimed_at', { ascending: false }),
        )
      : [];
  return (
    <section className="section">
      <div className="page-heading">
        <p className="location">{t('passport')}</p>
        <h1>{t('passportTitle')}</h1>
        <p>{t('passportBody')}</p>
      </div>
      <div className="passport-layout">
        <PassportPreview />
        <div className="passport-pages">
          <h2>
            {t('stamps')} <span className="count">{claims.length}</span>
          </h2>
          {claims.length ? (
            <div className="stamps">
              {claims.map((c) => (
                <StampDetail
                  className="stamp"
                  key={c.id}
                  name={
                    (c.stamp_definitions as unknown as { name: string } | null)?.name ?? t('claim')
                  }
                  date={new Intl.DateTimeFormat(locale, {
                    dateStyle: 'medium',
                    timeZone: 'America/Argentina/Cordoba',
                  }).format(new Date(c.claimed_at))}
                >
                  <Leaf size={30} />
                  <h3>{(c.stamp_definitions as unknown as { name: string } | null)?.name}</h3>
                  <time>
                    {new Intl.DateTimeFormat(locale, {
                      dateStyle: 'medium',
                      timeZone: 'America/Argentina/Cordoba',
                    }).format(new Date(c.claimed_at))}
                  </time>
                </StampDetail>
              ))}
            </div>
          ) : (
            <div className="empty-stamp">
              <Stamp size={50} />
              <h3>{t('stampEmpty')}</h3>
              <p>{t(passport ? 'activeEmptyBody' : 'emptyBody')}</p>
            </div>
          )}
          {!user ? (
            <AuthGate locale={locale} />
          ) : !passport ? (
            <ActionForm locale={locale} command="activate_passport" label={t('activate')}>
              <input type="hidden" name="destination_id" value={destinationId} />
            </ActionForm>
          ) : (
            <Button asChild>
              <Link href={`/${locale}/claim`}>
                <ScanLine size={18} />
                {t('scan')}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
