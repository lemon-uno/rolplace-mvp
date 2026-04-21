import { getResendClient, EMAIL_FROM, SITE_URL } from '@/lib/resend';

interface SendEmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
  userId?: string;
}

interface BatchRecipient {
  user_id: string;
  email: string;
}

export async function sendEmail({ to, subject, react, userId }: SendEmailParams) {
  const resend = getResendClient();

  const headers: Record<string, string> = {};
  if (userId) {
    const unsubUrl = `${SITE_URL}/api/email/unsubscribe?userId=${userId}&type=general`;
    headers['List-Unsubscribe'] = `<${unsubUrl}>`;
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
  }

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    react,
    headers,
  });

  if (error) throw error;
  return data;
}

export async function sendBatchEmails(
  recipients: BatchRecipient[],
  renderEmail: (recipient: BatchRecipient) => {
    subject: string;
    react: React.ReactElement;
  },
  batchSize = 100,
  delayMs = 1000
) {
  const batches = chunkArray(recipients, batchSize);
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    const emails = batch.map((recipient) => {
      const { subject, react } = renderEmail(recipient);
      const unsubUrl = `${SITE_URL}/api/email/unsubscribe?userId=${recipient.user_id}&type=general`;

      return {
        from: EMAIL_FROM,
        to: recipient.email,
        subject,
        react,
        headers: {
          'List-Unsubscribe': `<${unsubUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      };
    });

    try {
      const resend = getResendClient();
      await resend.batch.send(emails);
      sent += batch.length;
    } catch (err: unknown) {
      failed += batch.length;
      const message = err instanceof Error ? err.message : 'Batch send failed';
      errors.push(message);
    }

    if (i < batches.length - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return { sent, failed, errors };
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
