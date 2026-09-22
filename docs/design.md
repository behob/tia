# UI and UX direction

Inspected 20 September 2026. **Confirmed direction:** preserve the purchased Antra-based architecture/interior design appearance. This is documentation of the current system, not a redesign approval. See [requirements](prd.md) and [coding rules](rules.md).

## Existing visual system

Large interior photography, generous section spacing, prominent display headings, light gray surfaces, dark header/footer areas and muted gold accents define the current site. Reuse Bootstrap grid/container classes and the established `tl-*`, `post-*` and section classes before introducing a new pattern.

| Token / source                                                  | Current value or usage                                                                                |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--tl-ff-body`, `--tl-ff-p`                                     | Golos Text, sans-serif.                                                                               |
| `--tl-ff-heading`                                               | Cal Sans, serif fallback. Both brand fonts are local WOFF2 with swap and preloads.                    |
| `--tl-color-theme-primary`                                      | `#caa05c` accent.                                                                                     |
| `--tl-color-heading-primary` / `--tl-color-text-body`           | `#191919` / `#4d4d52`.                                                                                |
| `--tl-color-bg-1` / body background                             | `#1c1c1d` / `#f6f6f6`.                                                                                |
| `--tl-color-grey-1`, `--tl-color-grey-2`, `--tl-color-border-1` | `#59585d`, `#9f9fa4`, `#e3e3e8`; white/black tokens also exist.                                       |
| `--tl-fs-body`, `--tl-fs-p`                                     | 16px; body line-height 1.625; paragraphs use 28px line-height.                                        |
| Heading size tokens H1–H6                                       | 80, 60, 50, 40, 30, 20px defaults; section/component rules override them responsively.                |
| Containers                                                      | `.container` max 1795px; `.container-2` max 1425px, with Bootstrap gutters.                           |
| Section spacing                                                 | `pt/pb-130`: 130 → 80 → 60px at desktop / ≤992 / ≤767. `pt/pb-150`: 150 → 80 → 70px.                  |
| Buttons                                                         | `.tl-primary-btn`: outlined pill, 16px heading font, 40px circular arrow area; gold hover treatment.  |
| Focus                                                           | Global 3px `#ca9b65` outline with 4px offset in `SiteControls`; some controls also have scoped rules. |

Token sources: [colors](../src/assets/scss/utilities/_colors.scss), [typography](../src/assets/scss/utilities/_typography.scss), [CSS-variable generation](../src/assets/scss/utilities/_root.scss), [theme/layout utilities](../src/assets/scss/components/_theme.scss), [buttons](../src/assets/scss/components/_buttons.scss). There is no unified spacing/radius scale beyond current utilities and component values. Token consolidation is a proposal, not a current standard. The unused Google Fonts URL in SCSS is historical; the layout loads local brand fonts.

## Reusable composition and interactions

- `Layout`, `Header`, `Footer`, `PageHeader` and `SectionHeading` provide shared framing. `SectorLayout` preserves each sector's ordered sections rather than flattening all sectors into one design.
- Grid uses three columns on large screens, two on medium, one on small. List and Standard use an eight-column content area with a four-column sidebar on large screens; the sidebar stacks below on smaller screens. List cards share one structure, including the first card; their image/text columns collapse at 1199px.
- `BlogViewToggle` is a labeled navigation group with text/icons and `aria-current`. `BlogPagination` shows existing pages and only valid previous/next links; changing views preserves the page. These are links, not client-only filtering buttons.
- `BlogPostCard`, `BlogArchiveCard`, `ProjectCard`, `ServiceCard`, `TeamMemberCard` and `OptimizedImage` preserve established imagery and metadata treatment. Do not feature/enlarge the first List article again.
- `SiteControls` coordinates menu/search/sidebar focus, Escape, scroll locking and focus return. Mobile navigation is rendered in HTML with native disclosure groups. Footer social links use icons with accessible labels; Behance is absent.
- `ContactForm`, `NewsletterForm` and `FormFeedback` share validation/feedback behavior. Search includes a visible query field, result count and an empty-results message.

## Responsive and accessibility requirements

At 767px and below, Homepage reveal, text and slide targets render in their final state without SplitType or GSAP scroll-reveal initialization. Desktop motion remains unchanged. This prevents mobile content from waiting in invisible scroll states.

Existing SCSS mixins use max-width breakpoints 1700, 1600, 1399, 1199, 992 and 767px; controls additionally use 991px and 575px. Bootstrap and local overrides coexist. Preserve existing breakpoint behavior on touched pages rather than assuming a single new scale.

Retain semantic headings/landmarks, skip-to-content, unique IDs, visible labels or accessible names, keyboard-operable menus, focus containment/return, and descriptive image alt text. Keep primary mobile navigation/search controls at their existing 44px size. Do not communicate state by color alone. The focused [accessibility review](accessibility-review.md) confirmed core keyboard behavior; its verified contrast, inactive-carousel exposure and generic homepage alternative issues are fixed locally. The review's scope is not certification. Full-route coverage and a formal conformance target remain **TBD**.

Verify at 390px and 1440px as existing regression baselines, and at affected breakpoint edges. Avoid horizontal overflow, text clipping, distorted imagery or hidden primary content. Preserve eager/high-priority first-hero imagery, visible HTML before scripts, disabled hero autoplay and reduced-motion behavior. Do not reintroduce a blocking preloader or intercepted smooth scrolling.

## States

| State               | Implemented behavior / remaining gap                                                                                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial/loading     | Main content and hero render before JS. Turnstile initializes near viewport or on form focus. There is no general skeleton/loading framework.                                                                           |
| Submitting/disabled | Forms announce “Sending…”, set `aria-busy` and prevent duplicates. Security-protected submit buttons remain disabled while Turnstile loads, after expiry/error and during token refresh; callback success enables them. |
| Success             | Server response is announced; successful form resets. Production configuration is active, but received delivery and subscription/unsubscribe behavior remain unverified.                                                |
| Validation/error    | Native field constraints plus server feedback. Network/provider failures keep input and expose an email fallback; Turnstile resets after attempts.                                                                      |
| Service unavailable | Missing runtime configuration/disabled newsletter returns an unavailable message. The public form remains visible; do not describe it as active delivery.                                                               |
| Empty               | Search shows no-match guidance. A dedicated zero-post blog message is not implemented; its copy/behavior is TBD if required.                                                                                            |
| Missing page        | Custom 404 with a home link; missing live URLs return HTTP 404.                                                                                                                                                         |
| No JavaScript       | Blog links and content remain usable; search shows the full index. Protected forms require JavaScript for Turnstile and show an email fallback.                                                                         |

## Proposed direction

Measure production mobile performance and audit contrast/screen-reader behavior before prescribing changes. Any new spacing tokens, colors, motion, layout redesign or empty-state copy must be explicitly scoped, preserve existing designs and update this document. See [tasks](tasks.md); there is no approved rebrand or component-library replacement.
