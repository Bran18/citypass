import { getTranslations } from 'next-intl/server';
import { GuestForm } from '@/components/guest-form';
export const metadata = { robots: { index: false, follow: false } };
export default async function Precheckin() {
  const t = await getTranslations();
  return (
    <section className="section narrow">
      <h1>{t('precheckinTitle')}</h1>
      <p className="lead">{t('precheckinBody')}</p>
      <GuestForm />
    </section>
  );
}
