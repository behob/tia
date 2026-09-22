# Product requirements

Baseline: 20 September 2026. This document records the owner's requests and the current repository. **Implemented** means code exists; live activation and validation are stated separately. Product decisions marked **TBD** are not requirements to implement automatically.

## Purpose and users

Tiadecors / TIA Interior presents a Dubai architecture and interior design studio, its services, sector expertise, projects, and design articles. It helps visitors explore the studio and make an enquiry while allowing maintainers to publish consistent content without duplicating layouts.

**Audience assumption:** prospective residential and commercial clients, people researching interiors, and studio content maintainers. These audiences are inferred from the existing sector pages; priority segments and geographic reach beyond Dubai are **TBD**.

The confirmed problems are duplicated template content, confusing blog navigation, inconsistent list cards, manually maintained pagination, unnecessary scripts, and unreliable enquiry controls. Preserve the purchased template's visual design while improving these behaviors.

## Journeys and acceptance criteria

| ID     | Journey / requirement      | Testable acceptance criteria                                                                                                                                                                                                                                        | State                                                                                                                                                                                                  |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PRD-01 | Enter and change blog view | Desktop/mobile navigation has one Blog link to `/blog-grid`, without template-page submenu entries. Grid/List/Standard links preserve the current page and work without JavaScript.                                                                                 | Implemented; recorded local/live checks pass.                                                                                                                                                          |
| PRD-02 | Browse and read articles   | Every archive title, image, and Read More link opens the corresponding `/blog/[slug]` article using the shared single layout. The first List card uses the same structure as later cards.                                                                           | Implemented; local browser checks pass.                                                                                                                                                                |
| PRD-03 | Publish and paginate       | The original 15 posts have seven-day intervals from 2026-01-01 through 2026-04-09. Eligible posts sort newest first; each page has at most nine. Builds create page two at 10 posts and page three at 19, with no empty trailing page. Current archives show 9 + 6. | Implemented; boundary tests and live archive checks pass.                                                                                                                                              |
| PRD-04 | Find relevant content      | Search covers published articles, project detail records, and configured studio/service/sector pages. `?q=` is shareable; no results has a visible message. Without JavaScript, the full index remains readable. Category/tag links reach derived archives.         | Implemented; local interaction checks pass.                                                                                                                                                            |
| PRD-05 | Explore the studio         | Sector, service, project and team links retain their intended destinations and designs. Footer social links use accessible icons and exclude Behance.                                                                                                               | Implemented; claims/content still await owner review.                                                                                                                                                  |
| PRD-06 | Make an enquiry            | Valid submissions require the configured security check and provider success. Invalid input, provider failure and missing configuration yield honest feedback; failed submissions retain input. An email fallback remains available.                                | Code and production bindings active; mocked tests pass. Received delivery is not yet verified.                                                                                                         |
| PRD-07 | Subscribe with consent     | Newsletter requires explicit consent, Turnstile and `NEWSLETTER_ENABLED=true`; it creates a Resend contact. No success is shown on provider failure. Campaigns require an unsubscribe process.                                                                      | Backend configuration is active. Live Homepage currently omits the Turnstile public widget; repaired build awaits deployment and live verification. No subscriber or unsubscribe flow has been tested. |

Publication is **build-time**, not a scheduler: changing JSON or reaching a future publication date does not update production until a new build/deployment. The weekly schedule is confirmed for the original 15 posts; a mandatory cadence for future posts is **TBD**.

## Scope

**Current delivery baseline (working MVP, inferred; formal product sign-off TBD):** public studio/sector/service/project pages, a single blog collection and three archive presentations, article/taxonomy routes, search, accessible shared navigation, social icons, enquiry/newsletter implementation, SEO metadata, optimized images, and repeatable verification.

**Explicit constraints for this phase:** keep existing staff, testimonials, awards, statistics and project claims visible pending owner review. Preserve the template's designs. Email/newsletter configuration was activated on 22 September 2026; real sends, subscriber creation and campaigns still require their own authorization and verification.

**Potential follow-up work, not committed features:** production performance measurement, HTTP redirects for legacy URLs, remaining legacy-script reduction, editorial approval, and live form activation after the owner resumes it. See [tasks](tasks.md).

**Outside the implemented product scope:** visitor accounts, admin/CMS editing, checkout/payment processing, working public comment/review submission, newsletter campaign delivery, and automatic scheduled publishing. Shop/pricing/demo routes still exist; their presence does not establish a commerce requirement. Arabic/localization, CRM integration and these additional features require product decisions.

## Nonfunctional requirements and dependencies

- Preserve responsive layouts, image crops, visible keyboard focus, semantic controls, reduced-motion behavior and useful content before JavaScript loads. Use [design](design.md) for the existing system; formal accessibility certification is not established.
- Validate structured content at build time and form input on the server. Keep credentials and visitor submissions out of client bundles, committed files and logs; see [security boundaries](architecture.md#security-boundaries).
- Keep Blog/Contact/Search free of the legacy script stack. Existing regression limits allow at most 15 homepage legacy scripts and fewer than 550,000 uncompressed bytes; these are not real-user performance targets.
- Retain stable content IDs/URLs, article dates, appropriate canonicals, sitemap filtering, and a real HTTP 404.
- Stay within the pure-Astro and dependency constraints in [rules](rules.md). Deployment depends on Cloudflare Workers and existing KV configuration; forms additionally depend on Turnstile and Resend.

## Success measures and product decisions

Technical release measures: the relevant checks and full release verification pass; blog acceptance criteria above hold; public assets contain no configured private keys; live routes return expected statuses. Once activated, owner-approved delivery/subscription tests must succeed. Dated results are in [launch readiness](launch-readiness.md), not evidence of perpetual health.

**TBD:** qualified-enquiry/conversion targets, traffic baseline, performance/SLO targets, supported-browser policy, content approval owner and cadence, final business claims, retention/privacy policy, newsletter consent history/double opt-in and unsubscribe ownership, and the fate of directly accessible demo pages. No analytics events or legal policies are implied by this document.

Related: [architecture](architecture.md), [design](design.md), [tasks](tasks.md), [handoff](memory.md).
