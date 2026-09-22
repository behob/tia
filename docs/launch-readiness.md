# Launch readiness

Checked 20 September 2026 and updated 22 September 2026. Email and newsletter configuration is active; no real email/subscription test was performed. Existing business content remains visible pending owner review.

## Findings

**Newsletter release verification (22 September 2026):** the missing production Turnstile widget is resolved. Cloudflare build `7faf25f1-581b-459a-a9ed-37f37b2d4711` exposed the missing Git-build variable; the existing site key is now configured there as a masked variable and the pipeline runs `npm run build:release` once followed by `npx wrangler deploy`. Production visibly renders the widget, reaches Success and enables Subscribe. The application retains the callback token and explicitly places it in the request body; a mocked browser regression covers the empty generated-hidden-field case. Worker version `96c4214d-773f-4de8-bb2b-f3b0f430e96d` was deployed after release checks passed. No subscriber was created.

| Check               | Result                                                                                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local form settings | Contact address, sender address, Resend key, and both Turnstile keys are present. Values were not printed.                                                                                                                                        |
| Resend access       | The plugin connection confirms `tiadecors.com` is verified. A dedicated full-access deployment key passed read-only `/domains` and `/contacts?limit=1` checks and is stored only in ignored local configuration and the Worker secret binding.    |
| Newsletter          | `NEWSLETTER_ENABLED` is active locally and on the Worker. Contacts access is verified; no subscriber or unsubscribe test has been performed.                                                                                                      |
| Cloudflare access   | The account owns `tia`, and `tiadecors.com` maps to production. The Worker has the expected `SESSION` namespace and five form secret names. A secret-only deployment was created on 22 September.                                                 |
| Release command     | `npm run deploy` now builds the current source before deploying. Production release checks reject missing, placeholder, and Turnstile test keys, check every enhanced form's embedded key, and look for configured private keys in public output. |
| Content             | Staff, testimonials, awards, statistics and project claims are retained for owner review.                                                                                                                                                         |

## Local preparation

The full `npm run verify` suite passed in this readiness pass: 95 generated route pages, 71 collection records, 491 resized image variants, all 15 blog posts across three views, and desktop/mobile browser checks. A fresh `npm run build:release` also passed after Cloudflare sign-in. The local Cloudflare Worker served the homepage, contact, search, sector, blog archive and sitemap routes with HTTP 200, and a missing route with HTTP 404. Homepage and mobile contact screenshots were reviewed.

## Cloudflare setup and existing deployment verification

The official [Cloudflare agent setup instructions](https://developers.cloudflare.com/agent-setup/prompt.md) were applied on 20 September 2026. All 14 skills from `cloudflare/skills` were installed in `C:\Users\b2bij\.codex\skills`. Five MCP servers were added to `C:\Users\b2bij\.codex\config.toml`: `cloudflare`, `cloudflare-docs`, `cloudflare-bindings`, `cloudflare-builds`, and `cloudflare-observability`. All four private servers completed OAuth; documentation access is public. Restart Codex to load the MCP connections. The original configuration was backed up, and all pre-existing settings, including Headroom, were verified unchanged.

Read-only production checks confirmed:

- Active Worker version: `c9ba6261-b714-44b0-9b10-db96eba6ff7c`, deployed on 19 September 2026 at 19:13 UTC. The preceding version is `d1500d8f-4cf5-4d8b-8d1e-6a50a3a5363c`.
- `tiadecors.com` maps to `tia` in production. The deployed bindings are `ASSETS` and `SESSION`; the latter references the configured `tia-session` namespace. There are no deployed form secrets or newsletter flag.
- Homepage, contact, search, apartment sector, sitemap index, robots.txt, all 15 blog articles, and all six blog archive pages returned HTTP 200. A nonexistent route returned HTTP 404.
- Grid, List, and Standard each show nine posts on page one and six on page two. Titles, order, weekly publication dates, article links, page numbers, and canonical URLs match the content collection and intended Grid canonical routes.
- At the 20 September check, legacy `blog-single`, `blog-details`, and `index-2` pages returned HTTP 200 with browser redirects. The 23 September source now includes 26 Cloudflare `_redirects` rules covering both slash forms of all sector, blog-template and article aliases; deployment and live 301 verification are pending.

The machine-readable live check is in the ignored local file `.astro/cloudflare-live-verification.json`. On 22 September, managed Turnstile was confirmed restricted to `tiadecors.com`, the live form public key matched, and both production endpoints reached the Turnstile rejection using safe missing-token probes. No provider request, real email or subscription occurred. Deployment `97dc96fa-0831-435a-9a2d-f895b258f6fd` routes 100% to version `33895136-6337-4ff2-bcb6-3edc6d37cba3`. Actual delivery and subscription/unsubscribe behavior remain unverified.

```bash
npm run verify
npm run build:release
```

`verify` includes the existing desktop/mobile browser audits, image/content/SEO/link checks, mocked form tests, and tests of the release checks. It performs a Wrangler deployment dry-run only. CI deliberately uses a Turnstile test key for verification; that CI output must not be published as a production release.

`build:release` loads the production build environment using Vite's environment loader, then regenerates the legacy script and Astro output. It checks that every generated form embeds the current public Turnstile key. It does not authenticate that key with Cloudflare, verify the allowed hostnames, inspect production secrets, or prove email delivery.

## Live configuration and release

1. Sign in with `npx wrangler login`. Confirm the account owns the existing `tia` Worker and its `SESSION` KV namespace; preserve the existing production domain configuration.
2. List production secret names using `npx wrangler secret list`. Compare the presence of `CONTACT_EMAIL`, `SENDER_EMAIL`, `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY`. A local `.env` file does not configure deployed Worker secrets. Do not replace an existing production key with the local key that returned 401.
3. Confirm `PUBLIC_TURNSTILE_SITE_KEY` is the production widget key and its allowed hostnames cover the live site. Keep the private key only in server bindings. Build-time and runtime configuration must refer to the same widget.
4. Review the built site on desktop and mobile. Use `npm run preview` for local Wrangler preview. Keep existing business content pending review as requested.
5. When the release is ready, `npm run deploy` makes a fresh production build and publishes it. Record the deployed version and previous version for rollback. No deployment occurs from `verify` or `build:release`.
6. After deployment, verify the homepage, contact page, search, sector routes, all three blog views and second archive pages. Check the sitemap, canonical URLs, legacy redirects and a missing route's HTTP 404 response.

Email/newsletter activation is a separate pending step. Once authorized to activate, replace/verify the Resend key, confirm the sender domain, configure Worker bindings, and test with an owner-selected inbox. Confirm received delivery rather than relying only on an API success response. Verify newsletter subscription and unsubscribe behavior before setting `NEWSLETTER_ENABLED=true` for public use. Do not subscribe an arbitrary address or send a campaign during deployment checks.

## After deployment

A three-run production mobile lab baseline was captured on 22 September 2026 and repeated after the Font Awesome deployment on 23 September; see [performance baseline](performance-baseline.md). Transfer dropped by 796–830 KiB across the measured routes. Field Core Web Vitals remain unavailable.

Measure the deployed site's mobile performance and inspect actual network requests before further script/CSS changes. Submit or verify the sitemap in the owner's search-console account when access is available. Local regression budgets are not field Core Web Vitals measurements.

References: [Cloudflare secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/), [Resend domain listing](https://resend.com/docs/api-reference/domains/list-domains), [Resend contact listing](https://resend.com/docs/api-reference/contacts/list-contacts).
