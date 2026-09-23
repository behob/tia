# Project architecture

Inspected 20 September 2026. Current implementation is described below; proposed changes are separated at the end. See [requirements](prd.md) and [working rules](rules.md).

## Stack and confirmed constraints

| Layer       | Current implementation                                                                                       | Choice context                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework   | Astro 7.1.4, TypeScript 5.9.3 with Astro strict configuration                                                | Existing project; owner requires design preservation. `AGENTS.md` requires pure Astro for new work. Original framework-selection rationale is TBD. |
| Hosting     | `@astrojs/cloudflare` 14.0.0, Wrangler 4.114.0, Workers                                                      | Existing deployment target, explicitly requested by owner. Static pages with server API exceptions.                                                |
| Assets/UI   | SCSS via sass-embedded 1.100.0, Bootstrap grid, subset local icon fonts, selective legacy jQuery/GSAP/Swiper | Inherited Antra template; incrementally modernized to preserve layouts. No client framework integration is installed.                              |
| Content/SEO | Astro glob collections and Zod schemas; `@astrojs/sitemap` 3.7.3                                             | Shared validated content replaces duplicated template records; Grid canonicals consolidate archive presentations.                                  |
| Quality     | ESLint 10.8.0, Prettier 3.9.6, Playwright 1.63.0, Node assertion scripts                                     | Repository scripts and CI implement content, rendering and interaction regression checks.                                                          |

Versions above are resolved from [package-lock.json](../package-lock.json), not upgrade recommendations. Node `>=22` is declared; CI uses Node 24. Vite 8.1.5 and esbuild 0.28.1 are overrides; their original rationale is **TBD**. Use the lockfile and CI runtime.

## Structure

| Path                                                | Responsibility                                                                                                                                                                   |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/`                                        | File-based routes; collection-driven article/project/team/sector pages; legacy compatibility and remaining template pages. `api/` contains two server endpoints.                 |
| `src/layouts/`                                      | `Layout` supplies HTML shell, metadata, shared controls and asset loading. `BlogArchiveLayout`, `BlogSingleLayout`, `SectorLayout` compose content.                              |
| `src/components/`                                   | `layout/` navigation/footer; `cards/` records; `sections/` reusable content/forms; `sections/sectors/` preserved sector sections; `ui/` controls/images; `seo/` asset selection. |
| `src/content/`, `src/content.config.ts`             | JSON source records and collection schemas. Filenames supply persistent collection IDs.                                                                                          |
| `src/data/`                                         | Collection adapters, pagination, site/navigation, SEO, asset policy and remaining static template data. Not all data is migrated.                                                |
| `src/lib/formHandlers.ts`                           | Shared server validation, Turnstile verification, provider requests and responses.                                                                                               |
| `src/assets/images/`, `src/assets/scss/`            | Imported image sources and global SCSS.                                                                                                                                          |
| `public/`                                           | Public fallback images, vendor scripts/styles, local fonts and icons. Never a secrets location.                                                                                  |
| `scripts/`, `.github/workflows/verify.yml`          | Audits/build helpers and verification-only CI.                                                                                                                                   |
| `dist/client`, `dist/server`, `.astro`, `.wrangler` | Generated output/state; ignored. The adapter generates the deployable Worker config in `dist/server`.                                                                            |

`Layout.astro` links `homepage.scss` only on `/` and the full `main.scss` stylesheet on other routes. Both are compiled and fingerprinted by Vite. The homepage bundle excludes sector-specific `home-2` through `home-9` rules; component-scoped Astro styles still load with their components. Keep shared homepage styles in both SCSS entry points when changing them.

## Content models and flow

The [schema](../src/content.config.ts) is authoritative; counts are the inspected baseline, not hardcoded limits.

| Collection | Records | Key fields / behavior                                                                                                                                                                                                                               |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blog       | 15      | Title, excerpt, publication/modification dates, status, category, author, image variants, order, intro/sections/gallery, tags, aliases and optional quote/conclusion/comments. Status defaults to published, so set draft explicitly while writing. |
| Portfolio  | 17      | Listing group/order, imagery, project metadata, description/features and `reviewStatus`. Non-legacy detail URLs use file IDs.                                                                                                                       |
| Services   | 24      | Group/order, title/description, optional image/icon and `reviewStatus`. Group adapters feed existing service pages; there is no service `[slug]` route yet.                                                                                         |
| Team       | 7       | Name/role, biography/expertise/skills, imagery, listed flag and `reviewStatus`; detail routes use file IDs.                                                                                                                                         |
| Sectors    | 8       | Title/description, legacy path and ordered component names; `SectorLayout` resolves imported sections and fails on a missing section.                                                                                                               |

All 48 portfolio/service/team records currently have `reviewStatus: pending`. It is an editorial flag, **not** a visibility/access filter. Testimonials, sponsors, pricing and some section content still live in data modules or markup.

Build flow: JSON → schema validation → collection adapters → route generation/layouts → static HTML and transformed assets. `getBlogPosts()` filters published records through the build's UTC date and sorts descending date, then ascending order/ID. Shared pagination creates nine-post pages; aliases and old template routes are compatibility entry points. Search embeds its index in HTML and filters it in the browser; it has no search API or search database.

`OptimizedImage` maps legacy `/assets/img/` paths to imported metadata, generates responsive WebP variants and falls back to a public `<img>` if no import matches. Cloudflare `imageService: 'compile'` uses the default workerd prerenderer. A previous Node-prerender experiment produced misleading image variants; do not restore it without decoded-image validation.

## APIs and integrations

| Endpoint               | Contract                                                                                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/mail`       | JSON or URL-encoded `fullname`, `phone`, `email`, `message`, security token; Turnstile Siteverify followed by Resend `/emails`.                                                     |
| `POST /api/newsletter` | Same formats, `email`, `consent=yes`, security token; requires `NEWSLETTER_ENABLED=true`; Siteverify followed by Resend `/contacts` with subscription enabled. No campaign is sent. |

Both routes set `prerender=false` and read runtime `env` from `cloudflare:workers`. Replies are plain text with `Cache-Control: no-store`: 200 provider acceptance (also the intentional honeypot response), 400 invalid input/challenge, 403 mismatched supplied Origin, 413 oversized input, 415 unsupported format, 503 missing configuration/disabled newsletter, and 502 provider failure/timeout. Provider acceptance is not proof of received delivery.

Forms share component-scoped enhancement: lazy Turnstile loading, pending/disabled state, feedback and retry. The callback token is retained in component state and explicitly placed in the request body, so submission does not depend on Cloudflare populating its generated hidden field. Search/view/page state is in the URL or local DOM; there is no application-wide client state store. `SESSION` KV is bound by the adapter, but no application session usage or user login was found.

## Security boundaries

- Public site: anonymous read access; no customer authentication, roles or admin UI. Content publishing requires repository/deployment access managed outside the application.
- Server trust boundary: reject a supplied cross-origin Origin, unsupported/oversized bodies and invalid fields; enforce newsletter consent; verify Turnstile before provider requests. Origin can be absent, and it is not user authentication.
- Limits: name 100, phone 50, email 320, message 5,000 and token 2,048 characters. Body checks use a 20,000 Content-Length threshold and a decoded-text length limit; they do not stream-limit the request. Provider timeouts are 10 seconds for Siteverify and 15 seconds for Resend.
- Credentials stay in private Worker bindings/local ignored env files. Public Turnstile keys are intentionally embedded at build time. Logs record failure kind/status, not visitor content, addresses or tokens.
- No application rate limiter, consent-history store, double opt-in workflow or implemented unsubscribe endpoint was found. Abuse/privacy decisions and stronger controls are **TBD**, not claims of current protection.

## Configuration, deployment and verification

`audit:performance` records three cold mobile lab runs against the configured URL and writes ignored evidence under `.astro/`. The dated production result is documented in [performance baseline](performance-baseline.md); it is separate from field Core Web Vitals.

Source configuration: [Astro](../astro.config.mjs), [Wrangler](../wrangler.json), [environment example](../.env.example). The configured Worker is `tia`, with `ASSETS` and the existing `SESSION` KV namespace, `nodejs_compat`, compatibility date `2026-07-28`, observability and source-map upload enabled. Public base URL is `https://tiadecors.com`. No named staging environment is configured.

Build-time: `PUBLIC_TURNSTILE_SITE_KEY`. Runtime: `CONTACT_EMAIL`, `SENDER_EMAIL`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, optional `NEWSLETTER_ENABLED`. `CLOUDFLARE_WEB_ANALYTICS_SITE_TOKEN` exists in the env example, but no source consumer was found; dashboard injection/analytics operation is **TBD**. Local env values are not automatically production bindings.

`build:release` validates the public key, rebuilds and checks embedded keys/configured private-key leakage. `deploy` invokes that build and publishes; `check` only performs a deployment dry-run. Framework-generated Wrangler configuration redirects deployment to the built output: edit source configuration, not generated files. Native static-asset redirects are authored in `public/_redirects`; route audits verify their build output and 301 destinations. Reconcile live routes/bindings before publishing. Cloudflare Workers Builds is connected to the `main` branch: it runs `npm run build:release` with a masked build-time `PUBLIC_TURNSTILE_SITE_KEY`, then `npx wrangler deploy`. GitHub Actions remains verification-only. See [commands](rules.md#commands) and [launch readiness](launch-readiness.md) for runtime evidence and rollback version references.

Verification combines type/lint checks, Node assertion tests, generated HTML/content/SEO/link/image audits and desktop/mobile Playwright checks. Form requests are mocked, third-party calls are blocked in browser audits, and accessibility checks are partial. No CI or local pass proves delivery, production Turnstile hostnames, full accessibility conformance or field Core Web Vitals.

## Proposed changes and documentation drift

[Tasks](tasks.md) tracks deployed redirect verification and deferred accessibility, integration and content approval. Further script removal and service-detail consolidation remain proposals; no replacement framework, database or CMS has been selected.

Historical descriptions in [AGENTS.md](../AGENTS.md) mention MailChannels, 23 global scripts and pre-migration structure. Current code uses Resend, route-selected legacy assets and five collections. Its architectural guardrails still apply. The migration paragraph in the [blog README](../src/content/blog/README.md) says seven articles need expansion; they now have sections, as recorded in the later [audit report](website-audit-implementation.md). Editorial approval is still outstanding.
