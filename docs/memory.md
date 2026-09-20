# Project memory

Last updated: 20 September 2026. Read [rules](rules.md), [PRD](prd.md) and relevant source before changes. This is a handoff, not a substitute for inspection.

## Current state and confirmed decisions

- TIA Interior / Tiadecors is a Dubai studio website on Astro 7 and Cloudflare Workers, evolved from the purchased Antra template. Preserve its design; use pure Astro and native component behavior. See [architecture](architecture.md) and [design](design.md).
- Blog content is consolidated: 15 posts, one Blog navigation entry, Grid/List/Standard views, matching article routes, uniform List cards, and automatic build-time pagination at nine. Original weekly dates run 1 January–9 April 2026. New publication needs a build/deploy; no scheduler exists.
- Five validated collections contain 71 records. Eight sector routes compose extracted sections. Some template data/pages and legacy scripts remain; do not treat the migration as complete.
- **Owner decision:** keep staff, testimonials, awards/statistics and project content visible pending review. All portfolio/service/team records remain pending; do not approve or hide them automatically.
- **Owner decision:** leave email/newsletter activation pending. Resend/Turnstile handlers and mocks exist; live delivery is not established. The prior local Resend check returned 401, and the 20 Sep production check found no form secrets. Do not send messages or subscribe test addresses without the authorized next step.
- Preserve compile-time image processing with the adapter's default workerd prerenderer. The earlier Node-prerender experiment did not produce genuine resized variants. Regression checks decode generated dimensions.

## Important gaps

Legacy compatibility pages currently return HTML refresh redirects with HTTP 200; true HTTP redirects are open work. Remaining business/editorial approval, live form configuration, production performance measurements and product success targets are tracked in [tasks](tasks.md) and [PRD questions](prd.md#success-measures-and-product-decisions).

Older `AGENTS.md` factual descriptions and the blog migration README lag parts of the implementation; follow the current code and [architecture drift notes](architecture.md#proposed-changes-and-documentation-drift) while retaining the agent guardrails. An env-example analytics variable alone does not prove working analytics.

## Session handoff

Latest work: created the six linked development documents and added a reading-order note to root `AGENTS.md`; no application code changes. Inspected dependencies/configuration, schemas/counts/dates, layouts/styles, form handlers, scripts, CI and reports. Checked 59 relative links/anchors and npm script references; formatting and diff checks passed. DOC-001 is recorded in [tasks](tasks.md). The application suite was not rerun for prose changes.

Prior recorded checks: full `npm run verify` and `build:release` passed; read-only production checks verified blog pagination/dates/links and core routes. See [launch readiness](launch-readiness.md) for scope, deployed version and limitations. No new version was published during that verification. Local preview was last served on port 4330; check that it is still running before relying on it.

Pre-existing work at session start included modified `README.md`/`package.json` and untracked launch-readiness/release-check files. Preserve these changes; inspect current git status rather than assuming they are committed. Cloudflare agent skills/connections were installed as local developer tooling; their credentials/configuration are outside this repository and must not be copied into project docs.

Next: PERF-001, read-only production performance measurement. Email/newsletter tasks await the owner's resumed activation request and missing configuration; content review awaits approved material. Update this handoff when those facts change, linking evidence instead of appending a conversation transcript.
