import { getTranslations } from 'next-intl/server';
import { ShieldCheck } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
export default async function Privacy() {
  const t = await getTranslations();
  return (
    <section className="section narrow app-page privacy-page">
      <PageIntro title={t('privacy')} body={t('appUi.privacyIntro')} icon={ShieldCheck} />
      <div className="privacy-paper">
        <p>{t('privacyBody')}</p>
      </div>
    </section>
  );
}
