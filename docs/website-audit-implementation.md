# Website audit implementation

Updated 19 September 2026. Changes are local; this work does not deploy the website.

| # | Recommendation | Implementation |
|---|---|---|
| 1 | Repair Cloudflare contact bindings | API routes read `env` from `cloudflare:workers`. Shared server validation handles malformed input, limits, origins, provider failures and timeouts. |
| 2 | Make enquiry forms consistent | Contact and sector forms share `ContactForm`, Turnstile and accessible feedback. Inactive comment/review submission controls were replaced with enquiry links. Existing review text remains. |
| 3 | Connect newsletter subscriptions | Newsletter forms post to `/api/newsletter`, require consent and Turnstile, and create a Resend contact. Activation requires the configuration below. |
| 4 | Implement search | `/search` indexes published articles, project records and studio/sector/service pages. Header and blog sidebar searches work; results can be bookmarked. Without JavaScript the full index remains available. |
| 5 | Review business claims | **Retained at the owner's request.** Existing staff, testimonials, awards and statistics still need owner review. Migrated business records carry `reviewStatus: pending`; this flag does not hide them. |
| 6 | Complete short articles | Seven teaser-only posts now have full articles. Blog records support draft/published status and modification dates. Original weekly publication dates remain intact. |
| 7 | Clean navigation | Demo detail/shop/error/countdown links were removed from the main menu. Footer destinations were corrected; several placeholder social, sponsor and enquiry links were repaired. Demo pages remain directly accessible. |
| 8 | Optimize images | `OptimizedImage` uses `astro:assets`, source metadata, dimensions and responsive WebP variants. The image audit checks actual generated pixel widths, not just HTML attributes. |
| 9 | Render hero immediately | First slide images are eager/high priority; backgrounds render from HTML/CSS. The preloader no longer blocks first paint. |
| 10 | Reduce script delivery | Blog, contact and search pages no longer load the legacy script stack. Unused global libraries were removed; comparison and ticker scripts are route-specific. Complex legacy pages still use GSAP/Swiper/jQuery. |
| 11 | Respect reduced motion | Smooth-scroll interception was removed. Reduced motion disables the main decorative animation path, cursor and autoplay. Hero autoplay is off for all visitors. |
| 12 | Improve keyboard access | Native search/menu/sidebar controls support Escape, focus containment and focus return. Added a skip link, visible focus styles, server-rendered mobile navigation and a native back-to-top button. |
| 13 | Improve headings and article metadata | Home/sector primary titles and blog article titles are H1s. BlogPosting schema includes publication/modification dates, author and image. |
| 14 | Validate structured content | Portfolio, services and team now use schema-validated collections with persistent file IDs. Existing URLs and content are retained. |
| 15 | Reuse sector layouts | Eight `/spaces/[slug]` pages render ordered section components from collection records through `SectorLayout`. Old `index-2`–`index-9` pages redirect. |
| 16 | Canonicalize archive views | Grid is the canonical presentation for each archive page. List/Standard page 2 points to Grid page 2. Alternate presentations and utility routes are excluded from the sitemap. |
| 17 | Build taxonomy browsing | Category and tag pages derive from published posts, paginate at nine, and use real post links. Recent posts use publication order. |
| 18 | Trim styles and font requests | Simple routes load only needed vendor styles. Cal Sans and Golos Text are served locally as WOFF2 with swap and font preloads; licenses are included. Legacy global SCSS remains to preserve the designs. |
| 19 | Add a real not-found page | `404.astro` produces the custom 404 document. |
| 20 | Automate verification | GitHub Actions runs build, diagnostics, deployment dry-run, lint, content/SEO/link/assets checks, mocked form tests and browser checks. Worker observability is enabled; no deployment job is added. |

## Email and newsletter configuration

Set `CONTACT_EMAIL`, `SENDER_EMAIL`, `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` as Worker secrets. The sender domain must be verified in Resend. Set `PUBLIC_TURNSTILE_SITE_KEY` in the build environment; it is a public key embedded in static forms. Register the actual site hostname in Turnstile.

Newsletter activation additionally requires `NEWSLETTER_ENABLED=true` in Worker bindings and a Resend API key with Contacts access. The endpoint uses the current Contacts API, not the deprecated Audiences API. It adds subscribers to the account contact list; it does not send a campaign. Keep the flag off until the correct account and permissions are confirmed. Campaigns must provide the unsubscribe mechanism promised by the form. No real email or subscription was created during verification.

The forms report provider/configuration failures honestly, preserve input on failure, reset Turnstile after each attempt, and offer the studio email as a fallback. Provider logs exclude form content, addresses and tokens. Newsletter consent is explicit in the submitted request; a separate consent-history or double-opt-in system is not included.

## Publishing content

- Add a JSON file under `src/content/blog/` using an existing post as a model. Its filename is its permanent URL slug. Use `status: draft` while writing and `status: published` when ready. Dates use `YYYY-MM-DD`; future posts become eligible on a build on or after that date.
- Rebuild/deploy after publishing. Astro generates another archive page after each ninth eligible post. This is build-time pagination, so editing a repository file alone does not change the live site.
- Categories and tags generate archive routes automatically. Preserve existing slugs and aliases when updating posts.
- Edit business records in `src/content/portfolio`, `services` and `team`. Existing pending content is retained for review; approve records only after checking names, roles, projects and claims.
- Sector section order and metadata live in `src/content/sectors`. Their visual sections are in `src/components/sections/sectors`.

## Verification

Run `npm run verify` on Node 24 after `npm ci` and `npx playwright install chromium`. It builds before the Worker dry-run, which avoids checking stale output. The dry-run does not deploy. Form tests inject mock provider responses; browser tests block third-party requests and mock submissions. Browser screenshots are written under `.astro/site-verification` and `.astro/blog-verification`.

Image verification is deliberately separate: `npm run audit:images` checks decoded output widths against responsive descriptors. Cloudflare's `compile` image mode must use the supported default workerd prerenderer. Using the old Node prerender setting with this adapter version produced unchanged copies with misleading responsive descriptors.

The automated budgets prevent legacy scripts returning to simple pages and cap homepage legacy JS. They are regression checks, not measured field Core Web Vitals or a Lighthouse score. Recheck real-user performance and delivery after deployment.

Verification results: 95 route pages passed SEO/link checks, 71 collection records passed content checks, and 491 generated image variants passed decoded-width checks. The 15 published blogs passed all three views and both pages on desktop and mobile. Homepage legacy scripts decreased from 19 to 11 (481,191 uncompressed bytes); blog and contact pages load none of that legacy stack. The local Worker returned the custom missing-page document with HTTP 404 and rejected invalid contact/newsletter requests with HTTP 400.

## References

- [Astro Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Astro images](https://docs.astro.build/en/guides/images/)
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Resend Contacts API](https://resend.com/docs/api-reference/contacts/create-contact)
- [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
