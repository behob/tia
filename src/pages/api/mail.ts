import type { APIRoute } from 'astro';

export const prerender = false; // Ensure this endpoint is SSR/server-rendered

export const POST: APIRoute = async ({ request }) => {
  try {
    let fullname = '';
    let phone = '';
    let email = '';
    let message = '';

    // Handle JSON or Form UrlEncoded content types
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      fullname = body.fullname || '';
      phone = body.phone || '';
      email = body.email || '';
      message = body.message || '';
    } else {
      const formData = await request.formData();
      fullname = formData.get('fullname')?.toString() || '';
      phone = formData.get('phone')?.toString() || '';
      email = formData.get('email')?.toString() || '';
      message = formData.get('message')?.toString() || '';
    }

    fullname = fullname.trim();
    phone = phone.trim();
    email = email.trim();
    message = message.trim();

    if (!fullname || !phone || !email || !message) {
      return new Response(
        "Oops! There was a problem with your submission. Please complete the form and try again.",
        { status: 400 }
      );
    }

    // Update these for your domain
    const recipient = "contact@yourdomain.com";
    const subject = `Message from ${fullname}`;

    // Email body content
    const emailContent = `Name: ${fullname}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;

    // Call MailChannels Send API
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipient, name: 'Antra Contact' }],
          },
        ],
        from: {
          email: 'no-reply@yourdomain.com', // Replace with your domain sender when deploying
          name: fullname,
        },
        reply_to: {
          email: email,
          name: fullname,
        },
        subject: subject,
        content: [
          {
            type: 'text/plain',
            value: emailContent,
          },
        ],
      }),
    });

    if (response.ok) {
      return new Response("Thank You! Your message has been sent.", { status: 200 });
    } else {
      const errorText = await response.text();
      console.error('MailChannels Error:', errorText);
      return new Response(
        "Oops! Something went wrong and we couldn't send your message.",
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Mail Route Error:', error);
    return new Response(
      "Oops! Something went wrong and we couldn't send your message.",
      { status: 500 }
    );
  }
};
