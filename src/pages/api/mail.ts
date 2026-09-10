import type { APIRoute } from 'astro';

export const prerender = false;

type RuntimeWithEnv = {
  env?: Record<string, string | undefined>;
};

type ContactPayload = {
  fullname?: string;
  phone?: string;
  email?: string;
  message?: string;
  company_name?: string;
  'cf-turnstile-response'?: string;
  turnstileToken?: string;
};

const getRuntimeEnv = (locals: App.Locals) => {
  const runtime = (locals as App.Locals & { runtime?: RuntimeWithEnv }).runtime;
  return runtime?.env ?? {};
};

const getEnv = (locals: App.Locals, key: string) => getRuntimeEnv(locals)[key] || import.meta.env[key];

const getClientIp = (request: Request) =>
  request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

async function verifyTurnstile(token: string, secret: string, request: Request) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);

  const ip = getClientIp(request);
  if (ip !== 'unknown') {
    body.append('remoteip', ip);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    let fullname = '';
    let phone = '';
    let email = '';
    let message = '';
    let companyName = '';
    let turnstileToken = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as ContactPayload;
      fullname = body.fullname || '';
      phone = body.phone || '';
      email = body.email || '';
      message = body.message || '';
      companyName = body.company_name || '';
      turnstileToken = body['cf-turnstile-response'] || body.turnstileToken || '';
    } else {
      const formData = await request.formData();
      fullname = formData.get('fullname')?.toString() || '';
      phone = formData.get('phone')?.toString() || '';
      email = formData.get('email')?.toString() || '';
      message = formData.get('message')?.toString() || '';
      companyName = formData.get('company_name')?.toString() || '';
      turnstileToken = formData.get('cf-turnstile-response')?.toString() || '';
    }

    fullname = fullname.trim();
    phone = phone.trim();
    email = email.trim();
    message = message.trim();
    companyName = companyName.trim();
    turnstileToken = turnstileToken.trim();

    if (companyName) {
      return new Response('Thank You! Your message has been sent.', { status: 200 });
    }

    if (!fullname || !phone || !email || !message) {
      return new Response('Oops! There was a problem with your submission. Please complete the form and try again.', {
        status: 400,
      });
    }

    if (fullname.length > 100 || message.length > 5000 || phone.length > 50 || email.length > 320) {
      return new Response('Input exceeds maximum allowed length.', { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response('Please provide a valid email address.', { status: 400 });
    }

    const recipient = getEnv(locals, 'CONTACT_EMAIL');
    const senderEmail = getEnv(locals, 'SENDER_EMAIL');
    const resendApiKey = getEnv(locals, 'RESEND_API_KEY');
    const turnstileSecret = getEnv(locals, 'TURNSTILE_SECRET_KEY');

    if (!recipient || !senderEmail || !resendApiKey || !turnstileSecret) {
      console.error('Mail Route Error: required email or Turnstile environment variables are not configured');
      return new Response("Oops! Something went wrong and we couldn't send your message.", { status: 500 });
    }

    if (!turnstileToken || !(await verifyTurnstile(turnstileToken, turnstileSecret, request))) {
      return new Response('Please complete the security check and try again.', { status: 400 });
    }

    const subject = `Message from ${fullname}`;
    const text = `Name: ${fullname}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `TIA Interior <${senderEmail}>`,
        to: [recipient],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend Error:', errorText);
      return new Response("Oops! Something went wrong and we couldn't send your message.", { status: 500 });
    }

    return new Response('Thank You! Your message has been sent.', { status: 200 });
  } catch (error) {
    console.error('Mail Route Error:', error);
    return new Response("Oops! Something went wrong and we couldn't send your message.", { status: 500 });
  }
};
