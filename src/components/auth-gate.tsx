import { getTranslations } from 'next-intl/server';
import { signIn } from '@/app/actions';
import { configured } from '@/lib/supabase/server';
import { Button } from './ui/button';
export async function AuthGate({ locale }: { locale: string }) {
  const t = await getTranslations();
  return (
    <div className="auth-gate">
      <h2>{t('loginRequired')}</h2>
      <p>{t('signInNote')}</p>
      <form action={signIn.bind(null, locale)}>
        <Button disabled={!configured()}>{t('signIn')}</Button>
      </form>
    </div>
  );
}
