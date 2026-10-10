import { getTranslations } from 'next-intl/server';
export default async function Privacy() {
  const t = await getTranslations();
  return (
    <section className="section narrow">
      <h1>{t('privacy')}</h1>
      <p>{t('privacyBody')}</p>
    </section>
  );
}
