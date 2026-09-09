# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Snapshot

- This is `tia`, the TIA Interior / Tiadecors website.
- Stack: Astro 7, TypeScript strict mode, SCSS, static vendor assets, Cloudflare Workers via `@astrojs/cloudflare`.
- Main app code lives in `src/`.
- Static images, fonts, vendor CSS, and vendor JS live in `public/assets/`.
- Build output and local platform caches live in `dist/`, `.astro/`, and `.wrangler/`; treat these as generated.
- Contact form server code is in `src/pages/api/mail.ts` and sends via the MailChannels API using `CONTACT_EMAIL` and `SENDER_EMAIL`.

## Token-Saving Operating Rules

- Start every task with targeted searches, not broad file reads.
- Prefer `rg "term" src package.json astro.config.mjs wrangler.json` for discovery.
- Use `rg --files src` when mapping source files; avoid listing or reading `public/assets`, `node_modules`, `dist`, `.astro`, `.wrangler`, or `worker-configuration.d.ts` unless the task explicitly involves them.
- Do not paste full large page files into context. The homepage variants are very large; inspect narrow ranges or search for nearby headings/classes first.
- Before editing, identify the smallest likely owner:
  - global brand/contact/navigation: `src/data/site.ts`
  - layout shell/SEO/vendor includes: `src/layouts/Layout.astro`
  - header/footer/mobile/sidebar/search/preloader: `src/components/layout/`
  - repeated UI/cards/sections: `src/components/`
  - service/portfolio/blog/team/pricing content: `src/data/`
  - one-off landing/homepage sections: the matching `src/pages/*.astro`
  - form submission behavior: `src/pages/api/mail.ts` plus `public/assets/js/contact.js`
- Summarize findings before making large changes. Keep user-facing updates concise and avoid dumping command output.

## Development Commands

- Install dependencies: `npm install`
- Local dev server: `npm run dev`
- Production build: `npm run build`
- Full validation: `npm run check`
- Lint source: `npm run lint`
- Format source: `npm run format`
- Preview Cloudflare build locally: `npm run preview`
- Generate Cloudflare types: `npm run cf-typegen`

Use the cheapest command that matches the risk:

- Content-only Astro/data changes: `npm run build`
- TypeScript/API/config changes: `npm run check`
- Style-only SCSS changes: `npm run build`, with browser verification when layout risk is visible
- Deployment/config changes: `npm run check`

## Code Organization

- `src/pages/` contains route-level Astro pages. Many pages are template-derived and long.
- `src/data/` holds structured content already used by many pages. Prefer updating these files when possible.
- `src/components/cards/` contains repeated card components.
- `src/components/sections/` contains reusable page sections.
- `src/components/ui/` contains smaller shared UI such as page headers and section headings.
- `src/assets/scss/main.scss` forwards SCSS partials from `components/`, `layout/`, and `utilities/`.
- `public/assets/js/main.js`, `slider.js`, `banner-process.js`, and `contact.js` provide client-side behavior on top of static vendor libraries.

## Editing Guidelines

- Preserve the existing Astro + SCSS + Bootstrap template style unless the user asks for a redesign.
- Prefer structured data and component reuse over duplicating more markup inside large pages.
- Keep edits scoped. Avoid unrelated cleanup in template pages.
- Do not edit generated folders: `dist/`, `.astro/`, `.wrangler/`.
- Do not edit `node_modules/`.
- Be careful with `public/assets/`; most files are vendor libraries or static media. Only modify custom files when required.
- Keep formatting consistent with `.prettierrc`: 2 spaces, semicolons, single quotes, trailing commas, 120 character print width.
- Use ASCII unless editing existing copy that already contains intentional Unicode.

## Cloudflare And Environment

- `astro.config.mjs` sets `site` to `https://tiadecors.com`, uses sitemap integration, Cloudflare adapter, and `output: "static"`.
- `wrangler.json` points assets at `./dist`, enables `nodejs_compat`, and defines a `SESSION` KV binding.
- `.env` is ignored. Use `.env.example` as the public template for required variables.
- Never expose real environment values in commits, logs, or responses.

## Known Repository Notes

- The project contains many static template pages (`index-2.astro` through `index-9.astro`, shop pages, gallery pages, etc.).
- Some page copy appears placeholder-like or inconsistent; confirm desired business copy before sweeping text changes.
- The main homepage `src/pages/index.astro` is large and partly hard-coded, so search by section comment, class name, or visible copy before opening ranges.
- The reusable data layer is partial: inner pages use `src/data/*` more than the homepage does.
- Git may report a safe-directory/dubious-ownership warning inside sandboxed environments. Do not spend tokens on Git commands unless version status/history is needed for the task.

## Recommended Workflow

1. Read this file and the user request.
2. Run a narrow `rg` search for the exact feature, route, visible text, class, or data key.
3. Inspect only the matching files or small surrounding ranges.
4. Decide whether the change belongs in data, a component, a page, SCSS, or client JS.
5. Make the smallest viable edit.
6. Run the cheapest useful validation command.
7. Report changed files and validation result briefly.



# TIA Website Punch List

How to use this: drop this file in the repo root next to `AGENTS.md`. At the
start of every session, on every tool, tell the agent to read both files
first. Check items off (`- [x]`) and commit as you go — this file is your
shared memory across Codex, Antigravity, and OpenCode, since none of them
remember each other's sessions.

Tasks are tagged:
- **[YOU]** — needs a business decision, an account signup, or real assets
  only you have. No agent can do this one for you.
- **[Codex] / [Antigravity] / [OpenCode]** — which tool is the best fit and
  in what order, based on how much judgment vs. mechanical execution the
  task needs.

---

## Phase 1 — Codex (while ChatGPT Plus lasts)

Use your strongest reasoning budget on the decisions that are expensive to
get wrong or touch many files at once.

- [ ] **[YOU] Sign up for a real transactional email provider** (Resend,
      Postmark, or Cloudflare's Email Service) and get an API key. MailChannels'
      free Workers tier is dead — nothing downstream works until you have this.
- [ ] **[Codex] Rewrite `src/pages/api/mail.ts`** to send through that new
      provider using the key from `.env`. Update `.env.example` and `AGENTS.md`
      to match.
- [ ] **[Codex] Add spam protection to the contact form**: a honeypot field,
      Cloudflare Turnstile, and basic rate limiting using the `SESSION` KV
      binding that's already declared in `wrangler.json` but unused.
- [ ] **[Codex] Purge leftover "Antra" template branding** across the 17
      files that reference it, including the hardcoded `'Antra Contact'`
      sender name in `mail.ts` — that one reaches real inboxes.
- [ ] **[Codex] Fix the team-data bug**: `teamDetail.bio` in `src/data/team.ts`
      talks about "Mark Jackson" while `teamDetail.name` says "Ricardo Marlin."
      Needs one real founder bio — placeholder-swap this after you give Codex
      the real name/role/bio, or flag it and move on if you're not ready with
      real copy yet.
- [ ] **[YOU] Decide the real site structure**: which of the ~38 pages are
      keepers (the demo homepage variants `index-2`–`index-9`, `portfolio-2/3`,
      `service-2/3`, all the `blog-*` variants, `shop`/`shop-details`,
      `gallery-1/2`). Codex can propose a structure, but you own the final
      call on what TIA actually needs.
- [ ] **[Codex] Turn that decision into a real IA**: remap `site.ts` nav so
      "Apartments," "Villas," etc. point to real category pages instead of
      leftover homepage variants, and write out a plan for redirects/deletions
      for anything you're cutting (don't execute deletions yet — that's Phase 2).
- [ ] **[Codex] De-duplicate service copy** in `src/data/services.ts` — right
      now two different services share an identical description string.
- [ ] **[Codex, draft only] Draft a Privacy Policy and Terms page** given the
      contact form collects name/email/phone from UAE-based visitors (PDPL).
      Treat this as a first draft for your own review, not final legal copy.

---

## Phase 2 — Antigravity (once Codex's ChatGPT Plus limit is hit)

Antigravity's built-in browser and screenshot verification make it the
right tool for anything you need to *see* working correctly, not just read.

- [ ] **[Antigravity] Execute the Phase-1 IA plan**: delete/redirect the
      pages you decided to cut, wire the new nav, crawl the site in-browser
      to confirm nothing 404s.
- [ ] **[Antigravity] Migrate images to `astro:assets`/`<Image>`** and convert
      the 44MB of raw PNGs (several 1–2MB each) to compressed WebP/AVIF.
      Verify visually before/after — this is the single biggest performance win
      available.
- [ ] **[Antigravity] Audit the 23 `is:inline` vendor scripts** in
      `Layout.astro`. Figure out which pages actually use Three.js/Panolens
      (360° viewer) and Swiper, then load those conditionally per-page instead
      of globally. Verify each affected page still renders/functions after the
      change.
- [ ] **[Antigravity] Rewrite alt text** for real, page by page — it's
      currently generic (`alt="img"`, `alt="shape"`, `alt="project"`).
      Antigravity can look at each image and write accurate descriptions.
- [ ] **[Antigravity] Add analytics** (GA4 or Cloudflare Web Analytics) and
      confirm events fire in-browser.
- [ ] **[Antigravity] Turn on `observability: true`** in `wrangler.json` so
      you have Worker error visibility once this is live.
- [ ] **[Antigravity] Extend the JSON-LD schema** in `Layout.astro` beyond
      LocalBusiness — add per-project schema on portfolio pages once real
      project data exists.
- [ ] **[Antigravity] Move feasible vendor libraries to npm packages** instead
      of the currently-vendored static files in `public/assets/js/vendor/`, so
      you can actually track versions/CVEs going forward.

---

## Phase 3 — OpenCode free models (North Mini Code, DeepSeek V4 Flash, MiMo V2.5, Nemotron 3 Ultra)

These are solid for well-specified, low-ambiguity execution once you or an
earlier agent has made the judgment calls. Give exact instructions and real
content up front — don't ask a free model to make architectural decisions.

- [ ] **[YOU] Supply real social URLs** (Facebook, Instagram, LinkedIn, etc.)
- [ ] **[OpenCode] Swap the `#` placeholders in `site.ts`** for the real URLs
      above.
- [ ] **[OpenCode] Add `robots.txt`** to `public/` (standard content,
      referencing the sitemap already generated by `@astrojs/sitemap`).
- [ ] **[YOU] Supply real project photography** for the portfolio.
- [ ] **[OpenCode] Wire the real photos into `src/data/portfolio.ts`** and the
      portfolio pages, replacing the current stock-feeling renders.
- [ ] **[OpenCode] Replace remaining placeholder/Lorem-Ipsum copy** with
      final text once you've approved it (from Phase 1's drafts or your own).
- [ ] **[OpenCode] Run `npm run format && npm run lint`** and clean up
      whatever it flags before final deploy.

---

## Not a coding task at all

- [ ] **[YOU] Check the original template's license terms** (this looks like
      a converted "Antra"-style commercial HTML template) — confirm what your
      license allows for a live commercial business site before you launch.
