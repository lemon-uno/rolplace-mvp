import { Resend } from 'resend';

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY not configured');
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

const fromName = process.env.RESEND_FROM_NAME || 'Rolplace';
const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@example.com';

export const EMAIL_FROM = `${fromName} <${fromEmail}>`;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
