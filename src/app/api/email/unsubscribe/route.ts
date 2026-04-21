import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET: User clicks unsubscribe link in email
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId || !UUID_REGEX.test(userId)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  await supabaseAdmin
    .from('profiles')
    .update({ email_notifications_enabled: false })
    .eq('id', userId);

  return NextResponse.redirect(new URL('/email-unsubscribed', request.url));
}

// POST: RFC 8058 one-click unsubscribe (email client initiated)
export async function POST(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId || !UUID_REGEX.test(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  await supabaseAdmin
    .from('profiles')
    .update({ email_notifications_enabled: false })
    .eq('id', userId);

  return NextResponse.json({ success: true });
}
