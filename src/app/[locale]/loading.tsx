import { getTranslations } from 'next-intl/server';
export default async function Loading() {
  const t = await getTranslations();
  return (
    <div className="section" role="status">
      {t('loading')}
    </div>
  );
}
