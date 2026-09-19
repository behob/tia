export interface FormEnvironment {
  CONTACT_EMAIL?: string;
  SENDER_EMAIL?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  NEWSLETTER_ENABLED?: string;
}
const reply = (message: string, status = 200) =>
  new Response(message, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export async function handleForm(
  request: Request,
  env: FormEnvironment,
  kind: 'contact' | 'newsletter',
  send: typeof fetch = fetch,
) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return reply('Please submit the form from this website.', 403);
  if (Number(request.headers.get('content-length')) > 20000) return reply('The submission is too large.', 413);
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 20000) return reply('The submission is too large.', 413);
    if (request.headers.get('content-type')?.includes('application/json')) {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return reply('Invalid submission.', 400);
      body = parsed as Record<string, unknown>;
    } else if (request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
      body = Object.fromEntries(new URLSearchParams(raw));
    } else return reply('Unsupported form format.', 415);
  } catch {
    return reply('Invalid submission.', 400);
  }
  const field = (key: string) => (typeof body[key] === 'string' ? body[key].trim() : '');
  if (field('company_name')) return reply('Thank you for your submission.');
  const email = field('email');
  const fullname = field('fullname');
  const phone = field('phone');
  const message = field('message');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320)
    return reply('Please provide a valid email address.', 400);
  if (
    kind === 'contact' &&
    (!fullname || !phone || !message || fullname.length > 100 || phone.length > 50 || message.length > 5000)
  ) {
    return reply('Please complete your name, phone number and message within the displayed limits.', 400);
  }
  if (kind === 'newsletter' && field('consent') !== 'yes')
    return reply('Please confirm that you want to receive the newsletter.', 400);
  if (
    !env.RESEND_API_KEY ||
    !env.TURNSTILE_SECRET_KEY ||
    (kind === 'contact' && (!env.CONTACT_EMAIL || !env.SENDER_EMAIL)) ||
    (kind === 'newsletter' && env.NEWSLETTER_ENABLED !== 'true')
  ) {
    return reply('This form is temporarily unavailable. Please contact info@tiadecors.com.', 503);
  }
  const token = field('cf-turnstile-response') || field('turnstileToken');
  if (!token || token.length > 2048) return reply('Please complete the security check and try again.', 400);
  try {
    const validation = await send('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        ...(request.headers.get('cf-connecting-ip') ? { remoteip: request.headers.get('cf-connecting-ip')! } : {}),
      }),
    });
    if (!validation.ok || !((await validation.json()) as { success?: boolean }).success)
      return reply('The security check expired or failed. Please try again.', 400);
    const response = await send(`https://api.resend.com/${kind === 'contact' ? 'emails' : 'contacts'}`, {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(
        kind === 'contact'
          ? {
              from: `TIA Interior <${env.SENDER_EMAIL}>`,
              to: [env.CONTACT_EMAIL],
              reply_to: email,
              subject: `Website enquiry from ${fullname.replace(/[\r\n]/g, ' ')}`,
              text: `Name: ${fullname}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
            }
          : { email, unsubscribed: false },
      ),
    });
    if (!response.ok) {
      console.error('Form provider failure', { kind, status: response.status });
      return reply('We could not complete your request. Please try again or email info@tiadecors.com.', 502);
    }
    return reply(
      kind === 'contact'
        ? 'Thank you! Your message has been sent.'
        : 'Thank you! You are subscribed to the TIA Interior newsletter.',
    );
  } catch {
    console.error('Form provider unavailable', { kind });
    return reply('The service is temporarily unavailable. Please try again shortly.', 502);
  }
}
