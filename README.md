# Tiadecors

Architecture & interior design website built with [Astro](https://astro.build) and deployed on [Cloudflare Workers](https://workers.cloudflare.com).

## Stack

- **Framework:** Astro 7
- **Deployment:** Cloudflare Workers (via @astrojs/cloudflare)
- **Styling:** SCSS (via sass-embedded)
- **TypeScript:** Strict mode
- **Email:** Resend (contact enquiries and optional newsletter subscriptions), protected by Cloudflare Turnstile

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CONTACT_EMAIL` | Where contact form submissions are sent |
| `SENDER_EMAIL` | Sender address on a verified Resend domain |
| `RESEND_API_KEY` | Resend API key (starts with `re_`); install with `npm install resend` |
| `TURNSTILE_SECRET_KEY` | Server-side Cloudflare Turnstile secret |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public Turnstile site key supplied at build time |
| `NEWSLETTER_ENABLED` | Set to `true` in Worker bindings after confirming newsletter configuration |

Copy `.env.example` to `.env` and fill in the values.

### Setting up Resend for the Contact Form

1. Sign up at [resend.com](https://resend.com) and get your API key
2. Add your sending domain in Resend and verify it (e.g., `tiadecors.com`)
3. Replace `RESEND_API_KEY` with your actual Resend API key
4. Set `CONTACT_EMAIL` to where you want to receive enquiries
5. Set `SENDER_EMAIL` to an email on your verified Resend domain (e.g., `no-reply@tiadecors.com`)
6. Configure Cloudflare Turnstile keys for spam protection

Production secrets must also be configured on the Worker using:
```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CONTACT_EMAIL
npx wrangler secret put SENDER_EMAIL
npx wrangler secret put TURNSTILE_SECRET_KEY
```

See [the implementation and publishing guide](docs/website-audit-implementation.md) for setup details and [launch readiness](docs/launch-readiness.md) for release preparation. Local `.env` values are not automatically uploaded as Worker secrets.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Build and preview locally with Wrangler |
| `npm run build:release` | Validate the production public key, rebuild, and check the generated forms and public output |
| `npm run deploy` | Run `build:release`, then deploy to Cloudflare Workers |
| `npm run check` | Run type checking and validate deployment |
| `npm run verify` | Build, type/lint checks, Worker dry-run, content/SEO/image/link audits, mocked form tests and browser checks |
| `npm run audit:images` | Verify actual generated responsive image dimensions |
| `npm run audit:interactions` | Check desktop/mobile controls, form feedback, search and progressive rendering |
| `npm run audit:release -- --built` | Check the built Turnstile widgets and detect configured private keys in public output; does not verify live services |
| `npm run cf-typegen` | Generate Cloudflare type declarations |

## Project Structure

```
src/
├── assets/scss/   # SCSS source files
├── layouts/       # Layout components
├── pages/         # Page components + API routes
└── pages/api/     # Serverless API endpoints
public/
├── assets/css/    # Vendor CSS files
├── assets/fonts/  # Web fonts (Clash Display, Font Awesome)
├── assets/img/    # Images
└── assets/js/     # JavaScript (vendor + custom)
```

## License

All rights reserved.
