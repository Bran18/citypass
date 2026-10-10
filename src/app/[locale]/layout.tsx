import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Compass, BookOpen, Route, Gift, UserRound, Leaf, ArrowUpRight } from 'lucide-react';
import { configured } from '@/lib/supabase/server';
import '../globals.css';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/routing';
export const metadata = {
  title: 'Iguazú Passport',
  description: 'One passport. Your entire Iguazú experience.',
};
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const messages = await getMessages();
  const nav = [
    ['explore', '', Compass],
    ['passport', '/passport', BookOpen],
    ['routes', '/routes', Route],
    ['rewards', '/rewards', Gift],
    ['profile', '/profile', UserRound],
  ] as const;
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a className="skip" href="#main">
            {t('skip')}
          </a>
          <header className="site-header">
            <Link className="brand" href={`/${locale}`}>
              <Leaf size={27} />
              <span>
                Iguazú <b>Passport</b>
              </span>
            </Link>
            <nav className="desktop-nav" aria-label={t('explore')}>
              {nav.slice(0, 4).map(([key, path]) => (
                <Link key={key} href={`/${locale}${path}`}>
                  {t(key)}
                </Link>
              ))}
            </nav>
            <div className="header-actions">
              <nav className="languages" aria-label="Language">
                {['es', 'en', 'pt'].map((l) => (
                  <Link key={l} href={`/${l}`} aria-current={locale === l ? 'page' : undefined}>
                    {l.toUpperCase()}
                  </Link>
                ))}
              </nav>
              <Link className="profile-link" aria-label={t('profile')} href={`/${locale}/profile`}>
                <UserRound size={20} />
              </Link>
            </div>
          </header>
          {!configured() && <aside className="setup-banner">{t('setup')}</aside>}
          <main id="main">{children}</main>
          <footer>
            <Link className="brand" href={`/${locale}`}>
              <Leaf size={22} />
              Iguazú Passport
            </Link>
            <p>{t('onePassport')}</p>
            <div>
              <Link href={`/${locale}/privacy`}>{t('privacy')}</Link>
              <Link href={`/${locale}/hotel`}>
                {t('hotel')} <ArrowUpRight size={15} />
              </Link>
            </div>
          </footer>
          <nav className="mobile-nav" aria-label={t('explore')}>
            {nav.map(([key, path, Icon]) => (
              <Link key={key} href={`/${locale}${path}`}>
                <Icon size={21} />
                <span>{t(key)}</span>
              </Link>
            ))}
          </nav>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
