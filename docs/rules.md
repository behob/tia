# Coding and AI working rules

Read this file, [memory](memory.md), [AGENTS.md](../AGENTS.md), and the relevant [requirements](prd.md) before editing. Consult [architecture](architecture.md) and [design](design.md) for implementation context. User instructions and applicable `AGENTS.md` guardrails take precedence; report factual documentation drift instead of silently changing requirements.

## Working process

1. Inspect git status, relevant source, configuration, existing tests and nearby instructions. Preserve unrelated and pre-existing work; never reset it to obtain a clean tree.
2. Define a focused change against an acceptance criterion. Follow existing patterns; avoid incidental refactoring, mass formatting or guessed product decisions. Label assumptions and unresolved choices `TBD`.
3. Use existing dependencies first. Add or upgrade one only for a clear, stated need; include its lockfile and validation implications. Keep the pure-Astro constraint.
4. Run checks appropriate to the changed behavior. Report exactly what ran, passed, failed or was skipped, and distinguish mocked/local checks from live verification. Never claim a dry-run deployed the site.
5. Update affected requirements, architecture, design and task records when behavior or decisions change. Keep [memory](memory.md) a compact handoff with links, not a transcript. Mark tasks done only against checked acceptance criteria and retain verification limitations.

## Conventions and structure

- Use TypeScript/ES modules and the Astro strict config. New `.astro` components declare an explicit `interface Props`; prefer collection-derived types to duplicated model definitions.
- Existing convention: PascalCase reusable component/layout files, camelCase TS modules/functions and kebab-case route/content IDs. Preserve existing extracted sector filenames and IDs to avoid breaking references.
- Follow [.prettierrc](../.prettierrc): two spaces, semicolons, single quotes, trailing commas and 120-column preference; use the Astro parser. Avoid reformatting untouched files.
- Keep reusable sections in `src/components/sections/`, cards in `cards/`, and page composition in layouts/routes. Do not create more `index-*.astro` pages or duplicate whole pages for a new content item.
- Add structured content to schema-validated collections. Preserve filename IDs, aliases and existing URLs. Treat `reviewStatus: pending` as visible content until the owner directs otherwise; never mark claims approved without evidence.
- Services still have grouped legacy detail presentation. Prefer a collection-driven dynamic route for new detail work; do not imply that migration is already complete.

## Components, interaction and assets

- Prefer pure Astro and native browser APIs. Do not add React/Vue/Svelte, jQuery dependencies or new jQuery features without an explicit change in requirements.
- Use component-scoped bundled `<script>` tags for new behavior. **Do not add scripts to `Layout.astro`.** Existing route-specific legacy loading is controlled through `src/data/assets.ts` and `LegacyScripts`.
- Use ordinary links for archive view/page changes; preserve URL state and no-JavaScript navigation. Use buttons for actions, native form controls and minimal local DOM state.
- Prefer `OptimizedImage` / `astro:assets` and imported images with meaningful alt text and dimensions. Decorative images use empty alt. Preserve crops and hero priority; verify decoded output sizes, not just `srcset` labels.
- Reuse current tokens, layouts and components. Preserve semantic landmarks, unique IDs, accessible names, keyboard focus, Escape/focus return for dialogs and reduced motion. See [design](design.md) for responsive checks.
- The WebP migration is implemented; PNG favicon assets remain. Do not rerun bulk conversion on every task. Optimize new assets without bulk replacing working imagery or icons.

## APIs, validation and security

- Keep server integration logic in `src/lib/`; API routes remain thin and explicitly non-prerendered. Use `cloudflare:workers` runtime bindings, not build-time private values in client code.
- Validate on the server even when browser validation exists. Preserve documented content types, size/field limits, consent, origin check, honeypot, Turnstile validation, timeouts and failure statuses when changing forms.
- Do not send real emails, create subscribers or send newsletter campaigns as a side effect of tests. Production capture was activated on 22 September 2026, but real recipients/subscribers still require explicit authorization; use mocks otherwise.
- Show success only after the appropriate API result; preserve user input on failure and provide actionable fallback feedback. Keep provider detail and visitor content out of logs.
- Never commit credentials, private keys, form submissions or account tokens, including in docs, fixtures and screenshots. Store names/placeholders only; keep `.env*`, `.dev.vars*` and generated output ignored. Do not dump secret files when debugging.
- Do not render visitor input through `set:html`/`innerHTML`. Existing JSON-LD generation deserves careful serialization review when changed; its exception is not permission to insert arbitrary HTML.

## Commands

These commands are verified against [package.json](../package.json) and [CI](../.github/workflows/verify.yml). Prior execution evidence is in [launch readiness](launch-readiness.md); this documentation-only session does not rerun the application suite. Prefer Node 24 and the committed npm lockfile.

| Command                                             | Purpose / prerequisite                                                                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                            | Reproducible dependency install; do not casually regenerate the lockfile.                                                          |
| `npx playwright install chromium`                   | Browser prerequisite; CI uses `--with-deps` on Linux.                                                                              |
| `npm run dev`                                       | Astro development server; default port 4321 when available.                                                                        |
| `npm run build:legacy`                              | Regenerate `public/assets/js/main.min.js` after legacy source changes.                                                             |
| `npm run build`                                     | Generate static pages, optimized assets and Worker output.                                                                         |
| `npm run preview`                                   | Rebuild, then start local Wrangler preview; not production. Stop an old preview before rebuilding if Windows locks `dist`.         |
| `npm run lint` / `npm run check`                    | ESLint `src/`; Astro diagnostics, TypeScript and Wrangler dry-run. Build before `check` to avoid stale output.                     |
| `npm run test:forms` / `npm run test:release`       | Mocked form behavior and release-check fixtures.                                                                                   |
| `npm run audit:blog` / `npm run audit:interactions` | Built-output browser checks; need a build and Chromium.                                                                            |
| `npm run audit:images`                              | Check actual responsive image dimensions after building.                                                                           |
| `npm run verify`                                    | Full build, diagnostics, lint, mock tests and content/SEO/assets/link/accessibility/browser suite. No deployment.                  |
| `npm run build:release`                             | Production-key check → legacy build → Astro build → output checks. Does not verify live keys/delivery.                             |
| `npm run audit:release -- --built`                  | Validate existing built forms and scan for configured private-key exposure.                                                        |
| `npm run deploy`                                    | Fresh release build **and production publication**. Use only within authorized deployment scope and preserve remote configuration. |
| `npm run cf-typegen`                                | Regenerate Worker binding types after relevant config changes.                                                                     |
| `npm run format`                                    | Formats all of `src/`; prefer targeted `npx prettier --write <changed-files>` for focused changes.                                 |

CI uses a Turnstile test key. Do not deploy CI verification output as a production release. Release checks do not establish credentials are valid or installed remotely.

## Validation expectations

For content/routing changes, check collection validation, links, dates/order/pagination, canonicals and generated paths. For visual/interactive changes, compare desktop/mobile layouts (existing audits use 1440px and 390px), keyboard use, no overflow, no-JavaScript content and reduced motion. For forms, exercise malformed inputs, consent/config failures and mocked provider failures. Use the full suite for a release; repeat it only when changes or unresolved concerns justify it.

Documentation-only changes need source consistency, relative-link and formatting checks, and confirmation that application files were untouched. Do not add tests that merely restate implementation or claim complete accessibility/security from the current lightweight audits.
