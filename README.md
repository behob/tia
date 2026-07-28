# Tiadecors

Architecture & interior design website built with [Astro](https://astro.build) and deployed on [Cloudflare Workers](https://workers.cloudflare.com).

## Stack

- **Framework:** Astro 7
- **Deployment:** Cloudflare Workers (via @astrojs/cloudflare)
- **Styling:** SCSS (via sass-embedded)
- **TypeScript:** Strict mode
- **Email:** MailChannels Send API (contact form)

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CONTACT_EMAIL` | Where contact form submissions are sent |
| `SENDER_EMAIL` | "From" address used by the MailChannels API |

Copy `.env.example` to `.env` and fill in the values.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Build and preview locally with Wrangler |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run check` | Run type checking and validate deployment |
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
