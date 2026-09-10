# AGENTS.md

## Project Overview

**Tiadecors** is an architecture and luxury interior design studio website based in Dubai, UAE. The project is built with **Astro 7** and configured for deployment on **Cloudflare Workers** via `@astrojs/cloudflare`.

This codebase was originally migrated from an HTML5/CSS3/jQuery creative agency template ("Antra"). While the file extensions are `.astro`, much of the project currently operates as a "hybrid shell" with legacy template architecture that is being incrementally modernized into idiomatic Astro.

---

## Technical Stack & Dependencies

- **Framework**: Astro 7 (`astro: ^7.1.4`)
- **Runtime / Adapter**: Cloudflare Workers (`@astrojs/cloudflare: ^14.0.0`) with `output: 'static'`
- **Styles**: SCSS (`sass-embedded: ^1.100.0`) with global stylesheet imported in `src/layouts/Layout.astro`
- **Language**: TypeScript 5.9 (`strict: true`)
- **Linting & Formatting**: ESLint (`eslint-plugin-astro`), Prettier (`prettier-plugin-astro`)
- **Integrations**: `@astrojs/sitemap`
- **Email Delivery**: MailChannels Send API + Cloudflare Turnstile bot verification (`src/pages/api/mail.ts`)

---

## Commands & Workflows

| Command | Purpose |
|---|---|
| `npm run dev` | Starts local Astro development server on `http://localhost:4321` |
| `npm run build` | Builds static assets and Cloudflare worker entrypoint to `dist/` |
| `npm run preview` | Builds and launches local Cloudflare preview via Wrangler |
| `npm run check` | Runs Astro diagnostic check, TypeScript compile check, and Wrangler deploy dry-run |
| `npm run lint` | Lints files in `src/` using ESLint |
| `npm run format` | Auto-formats code in `src/` using Prettier |
| `npm run deploy` | Deploys output bundle to Cloudflare Workers via Wrangler |

---

## Codebase Architecture & Current State

### Directory Structure

```text
├── public/
│   ├── assets/
│   │   ├── css/       # Vendor CSS (bootstrap, fontawesome, venobox, etc.)
│   │   ├── fonts/     # Custom typography (Clash Display, Font Awesome)
│   │   ├── img/       # Unoptimized images in raw folders (project, blog, etc.)
│   │   └── js/        # Legacy vendor & theme scripts (jQuery, GSAP, Swiper, etc.)
├── src/
│   ├── assets/
│   │   └── scss/      # SCSS modular stylesheets (@forward architecture)
│   ├── components/
│   │   ├── cards/     # Card components (BlogPostCard, ProjectCard, ServiceCard, TeamMemberCard)
│   │   ├── layout/    # Header, Footer, MobileMenu, Sidebar, Preloader, SearchBox
│   │   ├── sections/  # NewsletterSection, SponsorCarousel, TestimonialSection
│   │   └── ui/        # PageHeader, SectionHeading
│   ├── data/          # Static data modules (site, services, blog, portfolio, team, etc.)
│   ├── layouts/
│   │   └── Layout.astro # Root HTML shell, SEO meta, schema markup, global script loader
│   ├── pages/
│   │   ├── api/       # API endpoints (mail.ts)
│   │   ├── index.astro # Primary homepage
│   │   ├── index-[2-9].astro # Sector-specific variations (Apartments, Villas, Retail, etc.)
│   │   └── [pages].astro # About, services, portfolio, blog, contact, pricing, etc.
├── astro.config.mjs   # Astro configuration (Cloudflare adapter, sitemap)
├── wrangler.json      # Cloudflare Workers configuration
└── package.json       # Project dependencies and script definitions
```

---

## Architectural Guardrails & Rules for AI Agents

When modifying or expanding this codebase, agents MUST adhere to the following principles:

### 1. Astro Component Best Practices
- **Favor Pure Astro**: Do NOT introduce heavyweight client-side frameworks (React, Vue, Svelte) unless explicitly directed. Use native `.astro` components for templating and HTML rendering.
- **Scoped Scripts**: Interactive behavior specific to a component should use standard `<script>` tags inside the component. Astro bundles and deduplicates these automatically.
- **Props Typing**: Always declare an explicit TypeScript `interface Props` in the frontmatter of any new component.
- **Semantic HTML**: Maintain valid semantic tags (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`). Ensure all interactive elements have accessible labels and unique IDs.

### 2. Eliminating Script Bloat
- **Do NOT add new scripts to `Layout.astro`**.
- The 23 vendor scripts currently loaded via `<script is:inline>` in `Layout.astro` are legacy technical debt slated for removal.
- Never add jQuery dependencies or jQuery-based plugins for new features. Use modern browser APIs (IntersectionObserver, Web Animations API, standard `addEventListener`).

### 3. Image Optimization (`astro:assets`)
- Prefer importing images from `src/assets/` and rendering via Astro's `<Image />` or `<Picture />` component instead of hardcoded `<img>` tags pointing to `/public/assets/img/`.
- Provide explicit `width`, `height`, and descriptive `alt` text to prevent Cumulative Layout Shift (CLS).

### 4. Routing & Template Duplication
- **Do NOT create new `index-*.astro` files**.
- Sector pages and portfolio/service items must be converted to dynamic routes (`[slug].astro`) driven by static data or Astro Content Collections.
- Reusable page sections must be extracted to `src/components/sections/` rather than inlining 500+ lines of HTML markup into page files.

### 5. Type Safety & Content Architecture
- Move away from unvalidated JavaScript objects in `src/data/`.
- All structured content (blog posts, portfolio projects, services, team members) should conform to schemas defined in `src/content.config.ts`.

---


- **Phase 0: WebP Image Conversion & Asset Optimization (Prerequisite)**
  - Convert all 268 legacy PNG, JPG, and JPEG images to WebP format using `sharp`
  - Update all image references across `src/pages/`, `src/components/`, `src/data/`, and `src/assets/scss/`
  - Reduce static asset weight by ~65-75% before structural code refactoring
- 