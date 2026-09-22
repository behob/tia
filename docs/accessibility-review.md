# Accessibility review

Reviewed 23 September 2026 against the deployed production site. This is a focused engineering review, not a WCAG conformance certification.

## Scope and method

Homepage, Blog Grid and Contact were reviewed in Chrome at 1440 × 1000 and 390 × 844 using keyboard navigation, browser accessibility snapshots, DOM/state inspection and computed color values. Existing structural checks remain covered by `npm run audit:a11y`; this review adds manual interaction and rendered-page evidence.

The review did not include physical assistive-technology testing, every route, every responsive breakpoint or a formal target such as WCAG 2.2 AA. Those limits should be addressed if the owner commissions a conformance audit.

## Confirmed behavior

- The skip link is first in keyboard order and moves focus to `main#main-content`.
- The homepage has one `h1`.
- The mobile navigation opens as a named dialog, contains keyboard focus, closes with Escape and returns focus to its trigger while updating `aria-expanded`.
- Contact controls have accessible names, status feedback is exposed, and social links have meaningful names.

## Findings

### A11Y-002: rendered contrast failures

Priority: P1.

Several rendered foreground/background pairs do not meet the usual WCAG AA thresholds for normal text or visible focus:

| Element                         | Rendered colors       |  Ratio | Applicable threshold |
| ------------------------------- | --------------------- | -----: | -------------------: |
| Global focus outline on white   | `#ca9b65` / `#ffffff` | 2.50:1 |                  3:1 |
| Blog metadata text at 13px      | `#9f9fa4` / `#ffffff` | 2.64:1 |                4.5:1 |
| Blog author/accent text at 13px | `#caa05c` / `#ffffff` | 2.42:1 |                4.5:1 |
| Category badge at 14px          | `#ffffff` / `#caa05c` | 2.42:1 |                4.5:1 |

Fix with context-specific text, badge and focus tokens rather than changing the brand accent globally. Recheck both light and dark surfaces and preserve a clearly visible focus treatment.

Resolved locally on 23 September: the focus outline is `#a66f32` (4.25:1 on white and 4.48:1 on `#101010`); blog metadata uses `#4d4d52` on white (8.40:1); author text uses `#191919` on white (17.58:1); and badge text uses `#191919` on `#caa05c` (7.28:1). Chrome computed-style checks at 390px and 1440px, the production build, lint, route audit and 95-route structural accessibility audit pass. Deployment verification remains part of the next release check.

### A11Y-003: inactive carousel slides remain exposed

Priority: P1.

The homepage accessibility tree contains repeated project, article and sponsor slide content from inactive/off-screen slides. This adds substantial duplicate navigation and reading noise for screen-reader users.

Keep only active/relevant slides available to assistive technology. Synchronize `aria-hidden` and `inert` with carousel changes, label each carousel and its controls, and verify that focus cannot enter hidden slides.

Resolved locally on 23 September: the shared Swiper setup now synchronizes `aria-hidden` and `inert` from rendered slide geometry on initialization, navigation, transition, resize and observer updates. The four homepage carousels have named regions. At 1440px, projects/testimonials/logos/articles expose 3/1/6/3 slides; at 390px they expose 1/1/2/1. Navigation changes the exposed project while hidden links remain inert. The browser interaction audit now protects the mobile state; deployment verification remains part of the next release check.

### A11Y-004: generic image alternatives

Priority: P2.

The homepage uses repeated generic alternatives including `img`, `sponsor`, `project`, `post`, `service` and `about`. Linked gallery images can consequently be announced only as “img,” which does not identify their destination or purpose.

Use an empty alternative for decorative images and concise, content-specific text for informative or linked images. Prefer data-driven alternatives so repeated card and gallery components remain consistent.

Resolved locally on 23 September: decorative homepage shapes, icons, duplicate portraits and unverified template logos now use empty alternatives. Project, article, about and linked gallery imagery has content-specific text. Shared sponsor data no longer fabricates numbered names. The structural audit now rejects the original generic homepage values and passes all 95 generated routes; deployment verification remains part of the next release check.

## Follow-up verification

After each fix, run the structural accessibility audit and repeat keyboard/accessibility-tree checks at 390px and 1440px. Contrast fixes should be measured from rendered computed styles, not inferred from source tokens alone.
