import { getTranslations } from 'next-intl/server';
import { session } from '@/lib/supabase/server';
import { AuthGate } from '@/components/auth-gate';
import { ClaimForm } from '@/components/claim-form';
export default async function Claim({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [t, user] = await Promise.all([getTranslations(), session()]);
  return (
    <section className="section narrow">
      <h1>{t('scan')}</h1>
      {user ? <ClaimForm locale={locale} /> : <AuthGate locale={locale} />}
    </section>
  );
}
