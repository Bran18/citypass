'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
export default function ErrorBoundary({ reset }: { reset: () => void }) {
  const t = useTranslations();
  return (
    <section className="section narrow">
      <h1>{t('errors.unavailable')}</h1>
      <Button onClick={reset}>{t('tryAgain')}</Button>
    </section>
  );
}
