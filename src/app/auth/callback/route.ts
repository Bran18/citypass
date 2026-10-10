import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeLocale } from '@/lib/validation';
export async function GET(request: NextRequest) {
  const locale = safeLocale(request.nextUrl.searchParams.get('locale') ?? 'es');
  const code = request.nextUrl.searchParams.get('code');
  const origin = new URL(process.env.APP_ORIGIN ?? 'http://127.0.0.1:3000').origin;
  if (code) {
    const db = await createClient();
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/${locale}/passport`);
  }
  return NextResponse.redirect(`${origin}/${locale}/profile?error=auth_failed`);
}
