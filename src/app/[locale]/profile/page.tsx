import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { session } from '@/lib/supabase/server';
import { AuthGate } from '@/components/auth-gate';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/actions';
export default async function Profile({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const [t, user] = await Promise.all([getTranslations(), session()]);
  return (
    <section className="section narrow">
      <h1>{t('profile')}</h1>
      {error && (
        <p role="alert" className="notice error">
          {t.has(`errors.${error}`) ? t(`errors.${error}`) : t('errors.unavailable')}
        </p>
      )}
      {user ? (
        <>
          <p>{user.email}</p>
          <form action={signOut.bind(null, locale)}>
            <Button variant="outline">{t('signOut')}</Button>
          </form>
        </>
      ) : (
        <AuthGate locale={locale} />
      )}
      <div className="portal-link">
        <Link href={`/${locale}/hotel`}>{t('hotel')}</Link>
        <p>{t('hotelBody')}</p>
      </div>
    </section>
  );
}
