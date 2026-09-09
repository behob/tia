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
