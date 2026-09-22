# Project memory

Last updated: 22 September 2026. Read [rules](rules.md), [PRD](prd.md) and relevant source before changes. This is a handoff, not a substitute for inspection.

## Current state and confirmed decisions

- 22 September implementation batch: all 15 posts use distinct high-resolution full-size interior assets while sidebar thumbnails remain separate. Homepage at 767px and below renders reveal targets directly, without SplitType/GSAP scroll-reveal setup; desktop motion remains. Production measurements are in [performance baseline](performance-baseline.md).

- TIA Interior / Tiadecors is a Dubai studio website on Astro 7 and Cloudflare Workers, evolved from the purchased Antra template. Preserve its design; use pure Astro and native component behavior. See [architecture](architecture.md) and [design](design.md).
- Blog content is consolidated: 15 posts, one Blog navigation entry, Grid/List/Standard views, matching article routes, uniform List cards, and automatic build-time pagination at nine. Original weekly dates run 1 January–9 April 2026. New publication needs a build/deploy; no scheduler exists.
- Five validated collections contain 71 records. Eight sector routes compose extracted sections. Some template data/pages and legacy scripts remain; do not treat the migration as complete.
- **Owner decision:** keep staff, testimonials, awards/statistics and project content visible pending review. All portfolio/service/team records remain pending; do not approve or hide them automatically.
- **Owner decision updated 22 September 2026:** activate email/newsletter configuration. The verified Resend domain, Contacts access, Turnstile widget/secret, local ignored environment and five Worker secrets are configured; `NEWSLETTER_ENABLED` is active. No message or subscriber was created, so received delivery and subscription/unsubscribe behavior remain unverified. Do not use real recipients or subscribers without explicit authorization.
- Preserve compile-time image processing with the adapter's default workerd prerenderer. The earlier Node-prerender experiment did not produce genuine resized variants. Regression checks decode generated dimensions.

## Important gaps

Legacy compatibility pages currently return HTML refresh redirects with HTTP 200; true HTTP redirects are open work. Remaining business/editorial approval, live form configuration, post-deployment performance comparison and unavailable field data and product success targets are tracked in [tasks](tasks.md) and [PRD questions](prd.md#success-measures-and-product-decisions).

Older `AGENTS.md` factual descriptions and the blog migration README lag parts of the implementation; follow the current code and [architecture drift notes](architecture.md#proposed-changes-and-documentation-drift) while retaining the agent guardrails. An env-example analytics variable alone does not prove working analytics.

## Session handoff

Latest work: activated production form configuration without changing application code. Resend lists `tiadecors.com` as verified and permits Contacts access; the Cloudflare `tia` Worker now has `CONTACT_EMAIL`, `SENDER_EMAIL`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` and `NEWSLETTER_ENABLED`. Managed Turnstile is restricted to `tiadecors.com`, and the live public key matches. Non-sending live probes reached Turnstile for both endpoints. Cloudflare deployment `97dc96fa-0831-435a-9a2d-f895b258f6fd` routes 100% to version `33895136-6337-4ff2-bcb6-3edc6d37cba3`. No real email/subscriber test was performed.

Prior recorded checks: full `npm run verify` and `build:release` passed; read-only production checks verified blog pagination/dates/links and core routes. See [launch readiness](launch-readiness.md) for scope, deployed version and limitations. No new version was published during that verification. Local preview was last served on port 4330; check that it is still running before relying on it.

Pre-existing work at session start included modified `README.md`/`package.json` and untracked launch-readiness/release-check files. Preserve these changes; inspect current git status rather than assuming they are committed. Cloudflare agent skills/connections were installed as local developer tooling; their credentials/configuration are outside this repository and must not be copied into project docs.

Next: FORM-001 deployment and read-only live Turnstile verification. Live Homepage currently omits the Turnstile container/public key, causing tokenless newsletter requests. Local repair always renders the container, disables submit until callback, shows load/error/expiry states and passes built newsletter-token regression. Production deployment was automatically rejected pending explicit owner approval; no workaround or live subscriber was created. PERF-002 follows after this release blocker.
