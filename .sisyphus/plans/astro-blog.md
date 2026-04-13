# Astro v6 Static Blog — blog.schaermu.ch

## TL;DR

> **Quick Summary**: Build a polished static blog from scratch using Astro v6 + Tailwind v4 with dark/light mode, Pagefind Component UI modal search, tag taxonomy, View Transitions, and GitHub Pages deployment.
> 
> **Deliverables**:
> - Complete Astro v6 static site at `blog.schaermu.ch`
> - Blog listing, post pages, tag pages, About page, 404 page
> - Dark/light mode toggle with system preference detection
> - Pagefind Component UI modal search (Cmd+K) with dev mode support
> - RSS feed + sitemap + Open Graph/Twitter Card meta
> - GitHub Actions CI/CD deploying to GitHub Pages
> - 1-2 sample blog posts with hero images and tags
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: T1 (scaffold) → T4 (content) → T7 (post page) → T11 (Pagefind) → T14 (deploy) → Final Verification

---

## Context

### Original Request
Build a static blog using Astro v6 with a modern, sleek design supporting both dark- and light-mode. Blog posts have optional hero images and use tags as taxonomy. Hosted on GitHub Pages (custom domain `blog.schaermu.ch`), searchable via Pagefind Component UI. Must work in dev mode. Use the visual companion for design direction.

### Interview Summary
**Key Discussions**:
- **CSS**: Tailwind CSS v4 chosen — CSS-first configuration model (no `tailwind.config.js`)
- **Search**: Pagefind 1.5 Component UI modal with built-in Cmd+K shortcut
- **Content**: Markdown (.md) with optional hero image and tags
- **Pages**: Blog listing, posts, tag listing, tag detail, About page
- **View Transitions**: Yes — `<ClientRouter />` for SPA-like navigation
- **Dev search**: Pre-built stale index strategy (build once for dev)
- **RSS + Sitemap**: Both included
- **Social meta**: Open Graph + Twitter Card
- **Reading time**: Inline calculation, no npm packages
- **Package manager**: pnpm
- **No unit tests**: Agent-Executed QA via `playwright-cli` skill only
- **QA Tool**: `playwright-cli` skill — **NOT** playwright MCP. This distinction is critical.

**Research Findings**:
- Greenfield project (empty directory, no existing code)
- Tailwind v4 uses CSS-first config: `@custom-variant dark`, `@theme` directive, `@tailwindcss/vite` plugin (not `@astrojs/tailwind`)
- Astro v6 Content Layer uses `id` not `slug` for routing; config at `src/content.config.ts`
- Pagefind Component UI does NOT auto-detect dark mode — must override `--pf-*` CSS vars
- View Transitions require `astro:before-swap` listener to persist theme
- GitHub Actions uses `withastro/action@v5` (not v2)

### Metis Review
**Identified Gaps** (addressed):
- Tailwind v4 CSS-first config model (corrected from v3 JS syntax)
- `id` vs `slug` in Content Layer API (corrected to `id`)
- `withastro/action@v5` not v2 (corrected)
- FOUC prevention via inline blocking `<script>` in `<head>`
- View Transition theme persistence via `astro:before-swap`
- Pagefind dark mode sync via CSS variable overrides
- `@tailwindcss/typography` integration via `@plugin` directive

---

## Work Objectives

### Core Objective
Build a production-ready, visually polished static blog that supports dark/light mode, full-text search, tag taxonomy, and automated deployment to GitHub Pages.

### Concrete Deliverables
- Astro v6 project with Tailwind v4 and all dependencies configured
- `BaseLayout.astro` and `BlogPostLayout.astro` layouts
- Blog listing page (`/`), blog post pages (`/blog/[id]/`), tag listing (`/tags/`), tag detail (`/tags/[tag]/`), About page (`/about/`), 404 page
- Dark/light mode toggle persisted to localStorage, respecting system preference, surviving View Transitions
- Pagefind Component UI modal search integrated in header with Cmd+K shortcut
- Dev mode search via pre-built stale index with documented workflow
- RSS feed at `/rss.xml`, sitemap at `/sitemap-index.xml`
- Open Graph + Twitter Card meta tags on all pages
- Reading time displayed on blog posts
- 1-2 sample blog posts with hero images, tags, and meaningful content
- GitHub Actions workflow deploying to GitHub Pages with custom domain
- `public/CNAME` file with `blog.schaermu.ch`

### Definition of Done
- [ ] `pnpm build` exits with code 0
- [ ] All expected routes exist in `dist/`
- [ ] Dark/light mode persists across navigation and page reload
- [ ] Pagefind modal opens with Cmd+K, returns results, navigates correctly
- [ ] RSS feed is valid XML with blog entries
- [ ] Social meta tags present on all pages
- [ ] GitHub Actions workflow file is valid and deployment-ready

### Must Have
- Astro v6.1 with Node 22+ requirement
- Tailwind v4 CSS-first configuration (NO `tailwind.config.js`)
- Pagefind 1.5 Component UI (NOT legacy Default UI)
- `<ClientRouter />` for View Transitions (NOT deprecated `<ViewTransitions />`)
- Content Layer API with `id`-based routing (NOT `slug`)
- Inline blocking theme script in `<head>` (FOUC prevention)
- `astro:before-swap` theme persistence for View Transitions
- `--pf-*` CSS variable overrides for Pagefind dark mode (NOT `data-pf-theme` attribute)
- `playwright-cli` skill for all QA scenarios (NOT playwright MCP)
- `frontend-design` skill for visual design direction

### Must NOT Have (Guardrails)
- NO `tailwind.config.js` as primary config — CSS-first only
- NO `@astrojs/tailwind` integration — use `@tailwindcss/vite` directly
- NO `slug` in content schemas or routing — use `id`
- NO more than 2 layouts (`BaseLayout` + `BlogPostLayout`)
- NO pagination on blog listing (single page)
- NO comment system (Giscus, Disqus, etc.)
- NO analytics (Plausible, Fathom, etc.)
- NO i18n / language switching
- NO JSON-LD / structured data (OG + Twitter Card only)
- NO scroll animations, parallax, or motion libraries beyond View Transitions
- NO skip-nav, ARIA live regions, or accessibility theater (standard semantic HTML, ARIA only where required like modal)
- NO npm packages for reading time — inline `Math.ceil(words / 200)` calculation
- NO error pages beyond 404
- NO tag clouds, related tags, or tag counts — simple listing only
- NO more than 2 theme modes (light + dark, system preference as initial default)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NONE
- **Framework**: N/A

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use `playwright-cli` skill (**NOT** playwright MCP) — Navigate, interact, assert DOM, screenshot
- **Build output**: Use Bash — check `dist/` file structure, validate build success
- **RSS/Sitemap/Meta**: Use Bash (curl + grep) — fetch endpoints, assert content
- **Theme persistence**: Use `playwright-cli` skill — toggle, navigate, assert `data-theme` attribute

**CRITICAL DISTINCTION**: All Playwright-based QA MUST use the `playwright-cli` skill loaded via `load_skills=['playwright-cli']`. Do NOT use playwright MCP tools. This applies to every task with UI verification.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — start immediately):
├── Task 1: Project scaffold + Astro v6 + Tailwind v4 + all deps [quick]
├── Task 2: Design system — Tailwind theme tokens + dark mode CSS [visual-engineering, frontend-design]
├── Task 3: Sample blog posts (2 markdown files with frontmatter) [quick]
└── Task 4: Content collection config + Zod schema [quick]

Wave 2 (Core pages — after Wave 1):
├── Task 5: BaseLayout + Header + Footer + ThemeToggle [visual-engineering, frontend-design]
├── Task 6: Blog listing page (/) [visual-engineering, frontend-design]
├── Task 7: Blog post page (/blog/[id]/) with hero image + reading time [visual-engineering, frontend-design]
├── Task 8: Tag listing (/tags/) + tag detail (/tags/[tag]/) pages [visual-engineering, frontend-design]
└── Task 9: About page + 404 page [visual-engineering, frontend-design]

Wave 3 (Features — after Wave 2):
├── Task 10: Dark/light mode system — toggle, localStorage, FOUC, View Transition persistence [deep]
├── Task 11: Pagefind Component UI — modal search + dark mode CSS sync + dev mode [deep]
├── Task 12: RSS feed + sitemap integration [quick]
└── Task 13: Social meta tags (OG + Twitter Card) on all pages [quick]

Wave 4 (Deployment — after Wave 3):
├── Task 14: GitHub Actions workflow + CNAME + deployment config [quick]
└── Task 15: View Transitions — ClientRouter + transition animations [unspecified-high]

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high, playwright-cli skill)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay

Critical Path: T1 → T4 → T5 → T7 → T10 → T11 → T14 → F1-F4 → user okay
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Waves 1 & 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| T1 | — | T2-T15 | 1 |
| T2 | T1 | T5-T9 | 1 |
| T3 | T1 | T4, T6-T8 | 1 |
| T4 | T1, T3 | T6-T8, T11, T12 | 1 |
| T5 | T1, T2 | T6-T9, T10, T11 | 2 |
| T6 | T2, T4, T5 | T11, T13 | 2 |
| T7 | T2, T4, T5 | T11, T13 | 2 |
| T8 | T2, T4, T5 | T13 | 2 |
| T9 | T2, T5 | T13 | 2 |
| T10 | T5 | T11 | 3 |
| T11 | T4, T5, T10 | T14 | 3 |
| T12 | T4 | T14 | 3 |
| T13 | T6-T9 | T14 | 3 |
| T14 | T10-T13 | Final | 4 |
| T15 | T5 | Final | 4 |

### Agent Dispatch Summary

- **Wave 1**: **4** — T1 → `quick`, T2 → `visual-engineering` + `frontend-design`, T3 → `quick`, T4 → `quick`
- **Wave 2**: **5** — T5 → `visual-engineering` + `frontend-design`, T6 → `visual-engineering` + `frontend-design`, T7 → `visual-engineering` + `frontend-design`, T8 → `visual-engineering` + `frontend-design`, T9 → `visual-engineering` + `frontend-design`
- **Wave 3**: **4** — T10 → `deep`, T11 → `deep`, T12 → `quick`, T13 → `quick`
- **Wave 4**: **2** — T14 → `quick`, T15 → `unspecified-high`
- **FINAL**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high` + `playwright-cli`, F4 → `deep`

---

## TODOs

- [ ] 1. Project Scaffold — Astro v6 + Tailwind v4 + All Dependencies

  **What to do**:
  - Initialize Astro v6 project in `/home/schaermu/projects/blog.schaermu.ch` using `pnpm create astro@latest` (empty template, no sample files)
  - Install all dependencies: `@tailwindcss/vite`, `@tailwindcss/typography`, `@pagefind/component-ui`, `@astrojs/rss`, `@astrojs/sitemap`, `pagefind` (dev dep)
  - Configure `astro.config.mjs`:
    - `site: 'https://blog.schaermu.ch'` (NO `base` config)
    - `output: 'static'`
    - Add `@tailwindcss/vite` as Vite plugin: `vite: { plugins: [tailwindcss()] }`
    - Add `@astrojs/sitemap` integration
    - Configure image service with codec-specific defaults (mozjpeg, webp effort 6, avif effort 4)
  - Create `src/styles/global.css` with: `@import "tailwindcss";` and `@plugin "@tailwindcss/typography";`
  - Add `"build": "astro build && pagefind --site dist"` to package.json scripts
  - Add `"search:index": "astro build && pagefind --site dist"` convenience script for dev mode stale index generation
  - Create `public/CNAME` with content `blog.schaermu.ch`
  - Create `.nvmrc` with `22` for Node version enforcement
  - Initialize git repo with proper `.gitignore` (include `dist/`, `node_modules/`, `.astro/`)

  **Must NOT do**:
  - Do NOT create `tailwind.config.js` — Tailwind v4 is CSS-first
  - Do NOT install `@astrojs/tailwind` — it's deprecated for v4
  - Do NOT set `base` in astro config
  - Do NOT add any layouts, pages, or components — those are separate tasks

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward project initialization with well-defined commands and config
  - **Skills**: `[]`
    - No special skills needed for scaffolding

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (runs first, all others depend on it)
  - **Blocks**: T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15
  - **Blocked By**: None (can start immediately)

  **References**:

  **External References**:
  - Astro v6 quickstart: `https://docs.astro.build/en/install-and-setup/`
  - Tailwind v4 + Vite: `https://tailwindcss.com/docs/installation/vite` — Install via `@tailwindcss/vite` plugin, CSS imports `@import "tailwindcss"`
  - Tailwind typography plugin v4: Use `@plugin "@tailwindcss/typography"` directive in CSS
  - Pagefind CLI: `https://pagefind.app/docs/` — postbuild indexing with `pagefind --site dist`
  - Astro sitemap: `https://docs.astro.build/en/guides/integrations-guide/sitemap/`
  - Astro image config v6.1: codec-specific Sharp defaults in `image.service.config`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Project builds successfully with all dependencies
    Tool: Bash
    Preconditions: All dependencies installed via pnpm
    Steps:
      1. Run `pnpm build` in project root
      2. Check exit code is 0
      3. Verify `dist/` directory exists
      4. Verify `dist/CNAME` contains `blog.schaermu.ch`
      5. Verify `dist/pagefind/` directory exists (Pagefind ran postbuild)
    Expected Result: Build succeeds, dist/ contains CNAME and pagefind index
    Failure Indicators: Non-zero exit code, missing dist/, Tailwind import errors
    Evidence: .sisyphus/evidence/task-1-build-success.txt

  Scenario: No forbidden config files exist
    Tool: Bash
    Preconditions: Project scaffolded
    Steps:
      1. Run `ls tailwind.config.js tailwind.config.ts 2>/dev/null` — expect no output
      2. Run `grep -r "@astrojs/tailwind" package.json` — expect no match
      3. Verify `src/styles/global.css` contains `@import "tailwindcss"`
      4. Verify `astro.config.mjs` does NOT contain `base:` property
    Expected Result: No tailwind config file, no @astrojs/tailwind dep, CSS-first setup confirmed
    Failure Indicators: tailwind.config.js exists, @astrojs/tailwind in deps
    Evidence: .sisyphus/evidence/task-1-no-forbidden-configs.txt
  ```

  **Commit**: YES
  - Message: `feat: scaffold Astro v6 project with Tailwind v4 and deps`
  - Files: `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `public/CNAME`, `.nvmrc`, `.gitignore`
  - Pre-commit: `pnpm build`

- [ ] 2. Design System — Tailwind Theme Tokens + Dark Mode CSS Foundation

  **What to do**:
  - In `src/styles/global.css`, define the complete design system using Tailwind v4's `@theme` directive:
    - Color palette for light AND dark modes (background, foreground, accent, muted, border, card colors)
    - Typography scale (font families, sizes, line heights)
    - Spacing scale if customizing beyond defaults
    - Border radius tokens
  - Define dark mode variant: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`
  - Define dark mode color overrides within `[data-theme="dark"]` selector using CSS custom properties
  - Define Pagefind dark mode CSS variable overrides within `[data-theme="dark"]`:
    - `--pf-text`, `--pf-text-secondary`, `--pf-background`, `--pf-border`, `--pf-hover`, `--pf-mark`, etc.
    - Match these to the site's dark theme colors for visual consistency
  - Set up base body styles (background, text color, font-family, transitions)

  **Must NOT do**:
  - Do NOT create `tailwind.config.js` — all config goes in CSS via `@theme`
  - Do NOT create components — this is tokens/variables only
  - Do NOT add motion or animation utilities beyond transition-colors for theme switch
  - Do NOT hard-code color values in components — all via CSS custom properties or Tailwind classes

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Design system creation requires visual design sensibility and CSS expertise
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Visual companion for choosing an aesthetically cohesive color palette and typography

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T3, T4 after T1)
  - **Parallel Group**: Wave 1 (with Tasks 3, 4)
  - **Blocks**: T5, T6, T7, T8, T9
  - **Blocked By**: T1

  **References**:

  **External References**:
  - Tailwind v4 `@theme` directive: `https://tailwindcss.com/docs/theme` — Define design tokens in CSS
  - Tailwind v4 dark mode: `https://tailwindcss.com/docs/dark-mode` — Use `@custom-variant dark` for selector-based dark mode
  - Tailwind v4 `@plugin` directive: `https://tailwindcss.com/docs/plugins` — For typography plugin
  - Pagefind CSS variables reference (from research): `--pf-text`, `--pf-text-secondary`, `--pf-text-muted`, `--pf-background`, `--pf-border`, `--pf-border-focus`, `--pf-skeleton`, `--pf-hover`, `--pf-mark`, `--pf-scroll-shadow`, `--pf-shadow-sm/md/lg`, `--pf-outline-focus`, `--pf-font`, `--pf-modal-backdrop`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Design system builds without errors
    Tool: Bash
    Preconditions: T1 complete, global.css has @theme and @custom-variant directives
    Steps:
      1. Run `pnpm build`
      2. Check exit code is 0
      3. Verify no Tailwind CSS compilation errors in output
    Expected Result: Build succeeds with design system CSS compiled
    Failure Indicators: CSS syntax errors, unknown directive warnings
    Evidence: .sisyphus/evidence/task-2-design-system-build.txt

  Scenario: No tailwind.config.js exists
    Tool: Bash
    Preconditions: Design system implemented
    Steps:
      1. Run `find . -name "tailwind.config.*" -not -path "*/node_modules/*"` — expect no output
      2. Verify `src/styles/global.css` contains `@custom-variant dark`
      3. Verify `src/styles/global.css` contains `@theme`
    Expected Result: All Tailwind config is CSS-first, no JS config file
    Failure Indicators: tailwind.config.js/ts found
    Evidence: .sisyphus/evidence/task-2-css-first-verified.txt
  ```

  **Commit**: YES (groups with T3, T4)
  - Message: `feat: add design system, content collection, and sample posts`
  - Files: `src/styles/global.css`
  - Pre-commit: `pnpm build`

- [ ] 3. Sample Blog Posts — 2 Markdown Files with Frontmatter

  **What to do**:
  - Create `src/content/blog/` directory
  - Create 2 sample blog posts as `.md` files with meaningful content (not lorem ipsum):
    - Post 1: A getting-started or welcome post (~300 words) WITH a hero image
    - Post 2: A technical-ish post (~400 words) WITHOUT a hero image (to test optional hero)
  - Each post must have frontmatter matching the schema (defined in T4):
    - `title`: string
    - `description`: string (for meta tags / listing excerpt)
    - `pubDate`: Date
    - `heroImage`: string (optional — path to image in `src/assets/`)
    - `tags`: string array (e.g. `["astro", "web-dev"]`)
  - Place a sample hero image in `src/assets/blog/` (can be any reasonable placeholder image, at least 1200x630px for OG compatibility)
  - Use at least 2 different tags across the posts to test tag listing/filtering
  - Include a code block in at least one post (to test syntax highlighting)

  **Must NOT do**:
  - Do NOT use lorem ipsum — write plausible blog content
  - Do NOT add more than 2 sample posts
  - Do NOT create the content collection config — that's T4

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Writing 2 markdown files with specific frontmatter is straightforward
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T2, T4 after T1)
  - **Parallel Group**: Wave 1 (with Tasks 2, 4)
  - **Blocks**: T4, T6, T7, T8
  - **Blocked By**: T1

  **References**:

  **External References**:
  - Astro Content Collections: `https://docs.astro.build/en/guides/content-collections/` — Frontmatter schema, file-based collections
  - Markdown in Astro: `https://docs.astro.build/en/guides/markdown-content/` — Frontmatter format, code blocks, syntax highlighting

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Sample posts exist with correct frontmatter
    Tool: Bash
    Preconditions: Posts created in src/content/blog/
    Steps:
      1. Count .md files in src/content/blog/ — expect 2
      2. Verify each file has `title`, `description`, `pubDate`, `tags` in frontmatter
      3. Verify exactly one file has `heroImage` in frontmatter
      4. Verify at least one file contains a fenced code block (```)
      5. Verify hero image file exists at referenced path in src/assets/blog/
    Expected Result: 2 valid posts, 1 with hero image, both with tags, 1 with code block
    Failure Indicators: Missing frontmatter fields, missing hero image file, lorem ipsum content
    Evidence: .sisyphus/evidence/task-3-sample-posts.txt
  ```

  **Commit**: YES (groups with T2, T4)
  - Message: `feat: add design system, content collection, and sample posts`
  - Files: `src/content/blog/*.md`, `src/assets/blog/*`
  - Pre-commit: `pnpm build`

- [ ] 4. Content Collection Config + Zod Schema

  **What to do**:
  - Create `src/content.config.ts` (NOT `src/content/config.ts` — this is the v6 location)
  - Define `blog` collection using Content Layer API:
    ```typescript
    import { defineCollection } from 'astro:content';
    import { glob } from 'astro/loaders';
    import { z } from 'astro/zod';
    ```
  - Define Zod schema:
    - `title`: `z.string()`
    - `description`: `z.string()`
    - `pubDate`: `z.coerce.date()`
    - `updatedDate`: `z.coerce.date().optional()`
    - `heroImage`: `z.string().optional()` (path to image asset)
    - `tags`: `z.array(z.string()).default([])`
  - Use `glob()` loader targeting `src/content/blog/**/*.md`
  - Export the collection via `collections` object

  **Must NOT do**:
  - Do NOT put config at `src/content/config.ts` — must be `src/content.config.ts` (v6 location)
  - Do NOT use `slug` — v6 Content Layer uses `id` (auto-generated from file path)
  - Do NOT use `z.string().email()` or similar — Zod 4 moved these to `z.email()`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single config file with well-defined schema — straightforward
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T2, T3 after T1 — but needs T3's posts to validate against)
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: T6, T7, T8, T11, T12
  - **Blocked By**: T1, T3

  **References**:

  **External References**:
  - Astro Content Layer API: `https://docs.astro.build/en/guides/content-collections/` — `defineCollection`, `glob` loader, `z` from `astro/zod`
  - Astro v6 upgrade guide: `https://docs.astro.build/en/guides/upgrade-to/v6/` — Content config location change, `id` vs `slug`
  - Zod 4 in Astro: `https://docs.astro.build/en/guides/upgrade-to/v6/#zod-4` — Validation method changes

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Content collection validates and builds
    Tool: Bash
    Preconditions: T1 + T3 complete, content.config.ts created
    Steps:
      1. Run `pnpm build`
      2. Check exit code is 0
      3. Verify no "content collection" errors in build output
      4. Verify `src/content.config.ts` exists (NOT src/content/config.ts)
      5. Grep for `slug` in src/content.config.ts — expect no match
    Expected Result: Build succeeds, content collection schema validates sample posts
    Failure Indicators: Zod validation errors, schema mismatch, wrong config location
    Evidence: .sisyphus/evidence/task-4-content-collection.txt
  ```

  **Commit**: YES (groups with T2, T3)
  - Message: `feat: add design system, content collection, and sample posts`
  - Files: `src/content.config.ts`
  - Pre-commit: `pnpm build`

- [ ] 5. BaseLayout + Header + Footer + ThemeToggle

  **What to do**:
  - Create `src/layouts/BaseLayout.astro`:
    - Accept `title`, `description`, `image` (optional, for OG) props
    - `<html lang="en">` with `data-theme` attribute (set by inline script)
    - `<head>` with: charset, viewport, favicon link, global CSS import, inline blocking theme script (reads localStorage, sets `data-theme` before first paint)
    - Slot for page-specific `<head>` content (meta tags)
    - Header component, `<main>` with slot, Footer component
    - `<ClientRouter />` from `astro:transitions` for View Transitions
  - Create `src/components/Header.astro`:
    - Site title/logo linking to `/`
    - Navigation links: Blog (`/`), Tags (`/tags/`), About (`/about/`)
    - ThemeToggle component
    - Pagefind modal trigger placeholder (container `<div>` for T11 to populate)
  - Create `src/components/Footer.astro`:
    - Copyright notice with current year
    - RSS feed link
    - Minimal, clean design
  - Create `src/components/ThemeToggle.astro`:
    - Button with sun/moon icons (use inline SVG, no icon libraries)
    - Client-side script that:
      - Reads current `data-theme` from `<html>`
      - Toggles between `light` and `dark`
      - Saves to `localStorage`
      - Updates `data-theme` attribute on `<html>` (no page reload)
    - Style to show sun icon in dark mode, moon icon in light mode
  - The inline blocking theme script in `<head>` MUST:
    - Read `localStorage.getItem('theme')`
    - Fall back to `window.matchMedia('(prefers-color-scheme: dark)')` if no stored preference
    - Set `document.documentElement.setAttribute('data-theme', theme)` SYNCHRONOUSLY
    - Be `is:inline` (not deferred/bundled by Astro)

  **Must NOT do**:
  - Do NOT install icon libraries (lucide, heroicons, etc.) — use inline SVG
  - Do NOT create BlogPostLayout yet — that's T7
  - Do NOT implement Pagefind search — just leave a container for T11
  - Do NOT implement View Transition animations — just include `<ClientRouter />`
  - Do NOT add skip-nav or ARIA live regions

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Layout, header, footer, and toggle require visual design sensibility
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Visual companion for header/footer layout, navigation styling, toggle button design

  **Parallelization**:
  - **Can Run In Parallel**: NO (other Wave 2 tasks depend on this)
  - **Parallel Group**: Wave 2 (runs first in wave, others depend on it)
  - **Blocks**: T6, T7, T8, T9, T10, T11
  - **Blocked By**: T1, T2

  **References**:

  **External References**:
  - Astro layouts: `https://docs.astro.build/en/basics/layouts/` — Slot pattern, head injection
  - Astro View Transitions: `https://docs.astro.build/en/guides/view-transitions/` — `<ClientRouter />` import and usage
  - Astro `is:inline` scripts: `https://docs.astro.build/en/guides/client-side-scripts/#opting-out-of-processing` — Critical for blocking theme script
  - Pagefind Component UI dark mode CSS vars (from research): Override `--pf-*` vars inside `[data-theme="dark"]`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Layout renders with header, footer, and theme toggle
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: T1-T4 complete, base layout created, dev server running
    Steps:
      1. Navigate to http://localhost:4321/
      2. Assert header element exists with navigation links
      3. Assert nav contains links with href="/", href="/tags/", href="/about/"
      4. Assert footer element exists
      5. Assert theme toggle button exists
      6. Take screenshot
    Expected Result: Page renders with header (nav + toggle), main content area, and footer
    Failure Indicators: Missing header/footer, broken navigation links, no toggle button
    Evidence: .sisyphus/evidence/task-5-layout-render.png

  Scenario: Theme toggle switches data-theme attribute
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Page loaded at http://localhost:4321/
    Steps:
      1. Read initial `data-theme` attribute on `<html>` element
      2. Click the theme toggle button
      3. Read `data-theme` attribute again — assert it changed (light→dark or dark→light)
      4. Evaluate `localStorage.getItem('theme')` in browser — assert it matches new data-theme
      5. Take screenshot in new theme
    Expected Result: data-theme toggles between light and dark, localStorage updated
    Failure Indicators: data-theme unchanged, localStorage not set
    Evidence: .sisyphus/evidence/task-5-theme-toggle.png

  Scenario: No FOUC on page load (inline script runs before paint)
    Tool: Bash
    Preconditions: Layout created
    Steps:
      1. Grep `src/layouts/BaseLayout.astro` for `is:inline`
      2. Verify the inline script appears BEFORE any `<link>` to stylesheets in `<head>`
      3. Verify the script reads `localStorage` and sets `data-theme`
    Expected Result: Inline blocking script present in <head> before stylesheets
    Failure Indicators: Script is deferred, missing is:inline, appears after stylesheets
    Evidence: .sisyphus/evidence/task-5-fouc-prevention.txt
  ```

  **Commit**: YES (groups with T6-T9)
  - Message: `feat: implement all page layouts and routes`
  - Files: `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/ThemeToggle.astro`
  - Pre-commit: `pnpm build`

- [ ] 6. Blog Listing Page (/)

  **What to do**:
  - Create `src/pages/index.astro`:
    - Import and use `BaseLayout`
    - Fetch all blog posts via `getCollection('blog')`
    - Sort posts by `pubDate` descending (newest first)
    - Render a card/list for each post showing:
      - Hero image thumbnail (if present, using Astro `<Image />` component)
      - Post title (linked to `/blog/[id]/`)
      - Publication date (formatted nicely)
      - Description/excerpt
      - Tag badges (linked to `/tags/[tag]/`)
      - Reading time (inline calc: `Math.ceil(body.split(/\s+/).length / 200)` min read)
    - No pagination — single page listing all posts
    - Responsive layout (cards should work on mobile and desktop)

  **Must NOT do**:
  - Do NOT add pagination
  - Do NOT install reading-time npm packages — inline calculation only
  - Do NOT add "related posts" or "popular posts" sections
  - Do NOT add sorting/filtering UI beyond the default date-descending order

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Blog listing card design requires visual layout skills
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Visual companion for card design, spacing, responsive grid

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T7, T8, T9 after T5)
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9)
  - **Blocks**: T11, T13
  - **Blocked By**: T2, T4, T5

  **References**:

  **External References**:
  - Astro `getCollection`: `https://docs.astro.build/en/reference/modules/astro-content/#getcollection` — Fetching content entries
  - Astro `<Image />`: `https://docs.astro.build/en/guides/images/#image--astroassets` — Optimized image component
  - Astro Content Layer `id`: entries use `id` (file-path-derived), NOT `slug`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Blog listing shows all posts sorted by date
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: T1-T5 complete, dev server running
    Steps:
      1. Navigate to http://localhost:4321/
      2. Assert page contains at least 2 blog post cards/items
      3. For each post card: assert title, date, description, and tag badges are visible
      4. Assert the first post has a more recent date than the second
      5. Assert reading time is displayed (e.g., "X min read")
      6. Click the first post title — assert navigation to /blog/[id]/
      7. Take screenshot
    Expected Result: All posts listed, newest first, with title, date, description, tags, reading time
    Failure Indicators: Missing posts, wrong sort order, missing metadata
    Evidence: .sisyphus/evidence/task-6-blog-listing.png

  Scenario: Post card with hero image shows thumbnail
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: At least one post has heroImage
    Steps:
      1. Navigate to http://localhost:4321/
      2. Find the post card that has a hero image
      3. Assert an <img> element exists within that card
      4. Assert the image has a non-empty src attribute
    Expected Result: Hero image thumbnail displayed on the post card
    Failure Indicators: No image element, broken src
    Evidence: .sisyphus/evidence/task-6-hero-thumbnail.png
  ```

  **Commit**: YES (groups with T5, T7, T8, T9)
  - Message: `feat: implement all page layouts and routes`
  - Files: `src/pages/index.astro`
  - Pre-commit: `pnpm build`

- [ ] 7. Blog Post Page (/blog/[id]/) with Hero Image + Reading Time

  **What to do**:
  - Create `src/layouts/BlogPostLayout.astro`:
    - Extends `BaseLayout` (passes title, description, image for OG)
    - Renders blog post with:
      - Hero image at full width (if present, using `<Image />` from `astro:assets`)
      - If no hero image: gracefully skip (no broken img, no layout shift)
      - Title as `<h1>`
      - Publication date + updated date (if present)
      - Reading time (`Math.ceil(body.split(/\s+/).length / 200)` min read)
      - Tag badges (linked to `/tags/[tag]/`)
      - Article body wrapped in `prose` class (from `@tailwindcss/typography`) for markdown styling
    - Responsive: hero image is full-width on mobile, constrained on desktop
  - Create `src/pages/blog/[...id].astro`:
    - Use `getCollection('blog')` + `getStaticPaths()` to generate pages
    - Use `render(entry)` from `astro:content` (NOT `entry.render()`)
    - Pass entry data to `BlogPostLayout`
  - Apply dark mode prose styling: Tailwind typography supports `prose dark:prose-invert` or customize via `@custom-variant`

  **Must NOT do**:
  - Do NOT add navigation between posts (prev/next)
  - Do NOT add a table of contents
  - Do NOT add related posts section
  - Do NOT use `slug` — use `id` for routing (`[...id].astro`)
  - Do NOT use `entry.render()` — use `render(entry)` from `astro:content`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Blog post layout with hero image, typography, and responsive design
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Visual companion for post typography, hero image treatment, spacing

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6, T8, T9 after T5)
  - **Parallel Group**: Wave 2 (with Tasks 6, 8, 9)
  - **Blocks**: T11, T13
  - **Blocked By**: T2, T4, T5

  **References**:

  **External References**:
  - Astro `getStaticPaths`: `https://docs.astro.build/en/reference/routing-reference/#getstaticpaths` — Dynamic route generation
  - Astro content rendering: `https://docs.astro.build/en/guides/content-collections/#rendering-body-content` — `import { render } from 'astro:content'`
  - Astro `<Image />`: `https://docs.astro.build/en/guides/images/` — Image optimization, responsive layouts
  - Tailwind Typography: `https://github.com/tailwindlabs/tailwindcss-typography` — `prose` class for markdown content, dark mode via `dark:prose-invert`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Blog post with hero image renders correctly
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: T1-T6 complete, dev server running, post with heroImage exists
    Steps:
      1. Navigate to the post URL that has a hero image (e.g., http://localhost:4321/blog/[first-post-id]/)
      2. Assert <h1> contains the post title
      3. Assert hero image <img> element is visible with non-empty src
      4. Assert publication date is displayed
      5. Assert reading time is displayed (e.g., "X min read")
      6. Assert tag badges are visible and linked to /tags/[tag]/
      7. Assert article body has prose styling (check for .prose class or equivalent)
      8. Take screenshot
    Expected Result: Post renders with hero image, title, date, reading time, tags, and styled body
    Failure Indicators: Missing hero image, unstyled body, missing metadata
    Evidence: .sisyphus/evidence/task-7-post-with-hero.png

  Scenario: Blog post without hero image renders gracefully
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Post without heroImage exists
    Steps:
      1. Navigate to the post URL without a hero image
      2. Assert no <img> hero element above the title (or in hero position)
      3. Assert no broken image placeholder or layout shift
      4. Assert title, date, reading time, tags, and body all render correctly
      5. Take screenshot
    Expected Result: Post renders cleanly without hero image, no visual artifacts
    Failure Indicators: Broken image icon, layout shift, missing content
    Evidence: .sisyphus/evidence/task-7-post-without-hero.png

  Scenario: Code block has syntax highlighting
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: At least one post contains a fenced code block
    Steps:
      1. Navigate to the post with a code block
      2. Locate the <pre><code> element
      3. Assert it contains styled spans (Shiki highlighting applies inline styles/classes)
    Expected Result: Code block has syntax highlighting colors
    Failure Indicators: Plain monospace text with no color styling
    Evidence: .sisyphus/evidence/task-7-code-highlight.png
  ```

  **Commit**: YES (groups with T5, T6, T8, T9)
  - Message: `feat: implement all page layouts and routes`
  - Files: `src/layouts/BlogPostLayout.astro`, `src/pages/blog/[...id].astro`
  - Pre-commit: `pnpm build`

- [ ] 8. Tag Listing (/tags/) + Tag Detail (/tags/[tag]/) Pages

  **What to do**:
  - Create `src/pages/tags/index.astro`:
    - Use `BaseLayout`
    - Fetch all blog posts via `getCollection('blog')`
    - Extract unique tags from all posts
    - Display tags as a simple list of links to `/tags/[tag]/`
    - Show post count per tag
    - Sort tags alphabetically
  - Create `src/pages/tags/[tag].astro`:
    - Use `BaseLayout`
    - Implement `getStaticPaths()` to generate one page per unique tag
    - Filter posts that have the current tag
    - Sort filtered posts by `pubDate` descending
    - Render same card/list format as blog listing (reuse pattern from T6)
    - Page title: "Posts tagged with [tag]"

  **Must NOT do**:
  - Do NOT create tag clouds or weighted tag visualizations
  - Do NOT add "related tags" or tag suggestions
  - Do NOT add pagination on tag detail pages
  - Do NOT extract card component into separate file unless code is literally duplicated (use same pattern/structure)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Tag listing and detail pages need visual consistency with blog listing
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Visual companion for tag badge styling, listing layout

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6, T7, T9 after T5)
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 9)
  - **Blocks**: T13
  - **Blocked By**: T2, T4, T5

  **References**:

  **External References**:
  - Astro dynamic routes: `https://docs.astro.build/en/guides/routing/#dynamic-routes` — `getStaticPaths` for tag pages
  - Astro `getCollection`: `https://docs.astro.build/en/reference/modules/astro-content/#getcollection` — Filtering by tag

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Tag listing page shows all unique tags
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: T1-T5 complete, sample posts have tags, dev server running
    Steps:
      1. Navigate to http://localhost:4321/tags/
      2. Assert page title/heading contains "Tags" or similar
      3. Assert at least 2 unique tags are displayed (matching sample post tags)
      4. Assert each tag is a link to /tags/[tag-name]/
      5. Assert post count is shown per tag
      6. Take screenshot
    Expected Result: All unique tags listed with counts, each linking to detail page
    Failure Indicators: Missing tags, wrong counts, broken links
    Evidence: .sisyphus/evidence/task-8-tag-listing.png

  Scenario: Tag detail page shows filtered posts
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Tag listing page works
    Steps:
      1. Navigate to a specific tag detail page (e.g., http://localhost:4321/tags/astro/)
      2. Assert page heading contains the tag name
      3. Assert only posts with that tag are shown
      4. Assert post cards have same format as blog listing (title, date, description)
      5. Take screenshot
    Expected Result: Only posts matching the tag are displayed
    Failure Indicators: All posts shown, wrong tag filter, missing posts
    Evidence: .sisyphus/evidence/task-8-tag-detail.png
  ```

  **Commit**: YES (groups with T5, T6, T7, T9)
  - Message: `feat: implement all page layouts and routes`
  - Files: `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro`
  - Pre-commit: `pnpm build`

- [ ] 9. About Page + 404 Page

  **What to do**:
  - Create `src/pages/about.astro`:
    - Use `BaseLayout` with title "About"
    - Placeholder content for the about page (author bio, site description)
    - Clean, readable layout with appropriate spacing
    - Can include a photo placeholder or avatar area
  - Create `src/pages/404.astro`:
    - Use `BaseLayout` with title "Page Not Found"
    - Friendly 404 message
    - Link back to home page
    - Clean, on-brand design matching site theme

  **Must NOT do**:
  - Do NOT create 500 or offline error pages
  - Do NOT add contact forms or social media widgets
  - Do NOT over-design — keep both pages simple and clean

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Static pages that need to match site design language
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Visual companion for about page layout, 404 page design

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6, T7, T8 after T5)
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8)
  - **Blocks**: T13
  - **Blocked By**: T2, T5

  **References**:

  **External References**:
  - Astro pages: `https://docs.astro.build/en/basics/astro-pages/` — Static page creation
  - Astro 404: `https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page` — Custom 404 page

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: About page renders with content
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: T1-T5 complete, dev server running
    Steps:
      1. Navigate to http://localhost:4321/about/
      2. Assert page has a heading
      3. Assert page has body content (not empty)
      4. Assert header and footer from BaseLayout are present
      5. Take screenshot
    Expected Result: About page renders with placeholder content in site layout
    Failure Indicators: 404 response, empty page, missing layout
    Evidence: .sisyphus/evidence/task-9-about-page.png

  Scenario: 404 page shows for unknown routes
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321/this-page-does-not-exist/
      2. Assert page contains "not found" or "404" text (case-insensitive)
      3. Assert a link to home page (href="/") exists
      4. Take screenshot
    Expected Result: Custom 404 page shown with back-to-home link
    Failure Indicators: Default browser 404, no custom page, missing home link
    Evidence: .sisyphus/evidence/task-9-404-page.png
  ```

  **Commit**: YES (groups with T5, T6, T7, T8)
  - Message: `feat: implement all page layouts and routes`
  - Files: `src/pages/about.astro`, `src/pages/404.astro`
  - Pre-commit: `pnpm build`

- [ ] 10. Dark/Light Mode System — Complete Integration

  **What to do**:
  - Verify and enhance the inline blocking theme script in `BaseLayout.astro` `<head>`:
    - Read `localStorage.getItem('theme')`
    - Fall back to `window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`
    - Set `document.documentElement.setAttribute('data-theme', theme)` synchronously
    - Must be `<script is:inline>` to execute before paint
  - Implement `astro:before-swap` event listener for View Transition theme persistence:
    ```javascript
    document.addEventListener('astro:before-swap', (event) => {
      const theme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      event.newDocument.documentElement.setAttribute('data-theme', theme);
    });
    ```
  - Implement system preference change listener (for when user hasn't explicitly chosen):
    ```javascript
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    });
    ```
  - Verify ThemeToggle component (from T5) correctly:
    - Toggles `data-theme` on `<html>`
    - Stores preference to `localStorage`
    - Uses `transition:persist` directive on the toggle button to maintain state during View Transitions
  - Verify Pagefind `--pf-*` CSS variable overrides in `[data-theme="dark"]` selector (from T2) work correctly with the toggle
  - Test that dark mode applies to ALL pages: listing, posts (including prose), tags, about, 404

  **Must NOT do**:
  - Do NOT add a third "auto/system" mode in the UI — just light and dark (system is the default when no localStorage)
  - Do NOT use `data-pf-theme` attribute — use CSS variable overrides only
  - Do NOT add transition animations for theme switch beyond `transition-colors`

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex integration across multiple components: inline script, view transitions, localStorage, system preference, Pagefind CSS sync
  - **Skills**: [`playwright-cli`]
    - `playwright-cli`: Required for verifying theme persistence across navigation, FOUC testing

  **Parallelization**:
  - **Can Run In Parallel**: NO (T11 depends on this for Pagefind dark mode)
  - **Parallel Group**: Wave 3 (runs before T11)
  - **Blocks**: T11
  - **Blocked By**: T5

  **References**:

  **External References**:
  - Astro View Transitions lifecycle: `https://docs.astro.build/en/guides/view-transitions/#lifecycle-events` — `astro:before-swap` event
  - Astro `transition:persist`: `https://docs.astro.build/en/guides/view-transitions/#maintaining-state` — Persist component state across navigations
  - Pagefind CSS variables (from research): `--pf-text`, `--pf-background`, `--pf-border`, `--pf-hover`, `--pf-mark`, `--pf-shadow-*`, `--pf-modal-backdrop`, `--pf-outline-focus`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Theme persists across View Transition navigation
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: All Wave 2 tasks complete, dev server running
    Steps:
      1. Navigate to http://localhost:4321/
      2. Click theme toggle to switch to dark mode
      3. Evaluate `document.documentElement.getAttribute('data-theme')` — assert "dark"
      4. Click a blog post link (triggers View Transition)
      5. Wait for navigation to complete
      6. Evaluate `document.documentElement.getAttribute('data-theme')` — assert still "dark"
      7. Navigate to /about/ page
      8. Evaluate `document.documentElement.getAttribute('data-theme')` — assert still "dark"
      9. Take screenshot on each page
    Expected Result: data-theme="dark" persists across ALL page navigations
    Failure Indicators: Theme resets to light on navigation, flash of wrong theme
    Evidence: .sisyphus/evidence/task-10-theme-persistence.png

  Scenario: Theme persists across full page reload
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321/
      2. Click theme toggle to set dark mode
      3. Evaluate `localStorage.getItem('theme')` — assert "dark"
      4. Reload page (full page reload, not View Transition)
      5. Evaluate `document.documentElement.getAttribute('data-theme')` — assert "dark"
      6. Assert no flash of light theme visible (inline script ran before paint)
    Expected Result: Dark mode survives page reload, no FOUC
    Failure Indicators: Theme resets, brief flash of light mode
    Evidence: .sisyphus/evidence/task-10-theme-reload.png

  Scenario: System preference is respected when no localStorage
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Dev server running
    Steps:
      1. Clear localStorage: `localStorage.removeItem('theme')`
      2. Emulate dark color scheme via Playwright: `page.emulateMedia({ colorScheme: 'dark' })`
      3. Reload page
      4. Evaluate `document.documentElement.getAttribute('data-theme')` — assert "dark"
      5. Emulate light color scheme: `page.emulateMedia({ colorScheme: 'light' })`
      6. Reload page
      7. Evaluate `document.documentElement.getAttribute('data-theme')` — assert "light"
    Expected Result: Without stored preference, system preference is followed
    Failure Indicators: Always defaults to one theme regardless of system preference
    Evidence: .sisyphus/evidence/task-10-system-preference.txt
  ```

  **Commit**: YES (groups with T11)
  - Message: `feat: add dark/light mode and Pagefind search`
  - Files: `src/layouts/BaseLayout.astro` (updated), `src/components/ThemeToggle.astro` (updated if needed)
  - Pre-commit: `pnpm build`

- [ ] 11. Pagefind Component UI — Modal Search + Dark Mode Sync + Dev Mode

  **What to do**:
  - Create `src/components/Search.astro`:
    - Import `@pagefind/component-ui` and its CSS
    - Render `<pagefind-modal-trigger>` and `<pagefind-modal>` web components
    - The trigger has built-in Cmd+K/Ctrl+K shortcut — no manual wiring needed
    - Configure trigger: `placeholder="Search..."` (or appropriate text)
  - Integrate Search component into Header (from T5):
    - Place in the header navigation area, replacing the placeholder container from T5
  - Dev mode stale index strategy:
    - Create a helper script or npm script `"search:index": "astro build && pagefind --site dist"` (may already exist from T1)
    - Add `<pagefind-config bundle-path="/pagefind/">` element to configure the search index path
    - The Component UI will gracefully degrade if no index exists (no crash, just no results)
  - Pagefind dark mode CSS sync:
    - Verify the `--pf-*` CSS variable overrides defined in T2 (inside `[data-theme="dark"]` selector) are correctly applied
    - The Pagefind modal should automatically pick up the dark theme colors when `data-theme="dark"` is set on `<html>` because the CSS variables cascade
  - Add `data-pagefind-body` attribute to the main content area in BaseLayout to scope what Pagefind indexes
  - Add `data-pagefind-ignore` to header/footer/nav to exclude non-content from search
  - Add `data-pagefind-meta` attributes for blog post metadata:
    - `data-pagefind-meta="image[src]"` on hero images
    - Title and description are auto-detected from `<h1>` and `<meta>` tags
  - Add `data-pagefind-filter="tag"` on tag elements in blog posts so Pagefind can filter by tag

  **Must NOT do**:
  - Do NOT use legacy `pagefind-ui.js` or `new PagefindUI()` — Component UI only
  - Do NOT use `data-pf-theme` attribute — dark mode via CSS variable overrides
  - Do NOT try to make search fully live during dev — stale index is the accepted strategy
  - Do NOT build custom search UI — use the prebuilt `<pagefind-modal>` component

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex integration: web components, CSS variable theming, Pagefind indexing, dev mode strategy, data attributes for indexing
  - **Skills**: [`playwright-cli`]
    - `playwright-cli`: Required for testing modal open/close, search interaction, result navigation

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on T10 for dark mode integration)
  - **Parallel Group**: Wave 3 (after T10)
  - **Blocks**: T14
  - **Blocked By**: T4, T5, T10

  **References**:

  **External References**:
  - Pagefind Component UI full reference (from research): `<pagefind-modal>`, `<pagefind-modal-trigger>`, `<pagefind-config>` — attributes, keyboard shortcuts, CSS variables
  - Pagefind npm package: `@pagefind/component-ui` — `import '@pagefind/component-ui'; import '@pagefind/component-ui/css';`
  - Pagefind indexing attributes: `https://pagefind.app/docs/indexing/` — `data-pagefind-body`, `data-pagefind-ignore`, `data-pagefind-meta`, `data-pagefind-filter`
  - Pagefind CSS customization (from research): All `--pf-*` variables listed in Component UI reference. Override within `[data-theme="dark"]` for dark mode.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Search modal opens with Ctrl+K and returns results
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Run `pnpm build` first to generate Pagefind index, then `pnpm preview`
    Steps:
      1. Navigate to http://localhost:4321/ (or preview port)
      2. Press Ctrl+K (or Meta+K on Mac)
      3. Assert the pagefind-modal is visible/open
      4. Type a word that appears in a sample blog post title
      5. Wait for results to appear (debounce)
      6. Assert at least 1 search result is displayed
      7. Click the first result
      8. Assert navigation to the correct blog post URL
      9. Take screenshot of modal with results
    Expected Result: Modal opens, shows relevant results, clicking navigates to post
    Failure Indicators: Modal doesn't open, no results, navigation fails
    Evidence: .sisyphus/evidence/task-11-search-modal.png

  Scenario: Search modal respects dark mode
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Pagefind index built, preview running
    Steps:
      1. Navigate to http://localhost:4321/
      2. Toggle to dark mode
      3. Press Ctrl+K to open search modal
      4. Assert modal background color matches dark theme (not white/light)
      5. Take screenshot of modal in dark mode
      6. Toggle to light mode
      7. Press Ctrl+K again
      8. Assert modal background color matches light theme
      9. Take screenshot of modal in light mode
    Expected Result: Search modal colors match site theme in both modes
    Failure Indicators: Modal always light, colors don't update on toggle
    Evidence: .sisyphus/evidence/task-11-search-dark-mode.png

  Scenario: Search trigger button is visible in header
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321/
      2. Assert pagefind-modal-trigger element is visible in header area
      3. Assert it shows search text or icon
      4. Assert it shows keyboard shortcut hint (⌘K or Ctrl+K)
    Expected Result: Search trigger visible in header with shortcut hint
    Failure Indicators: Trigger not visible, missing shortcut display
    Evidence: .sisyphus/evidence/task-11-search-trigger.png
  ```

  **Commit**: YES (groups with T10)
  - Message: `feat: add dark/light mode and Pagefind search`
  - Files: `src/components/Search.astro`, `src/components/Header.astro` (updated), `src/layouts/BaseLayout.astro` (data-pagefind attributes)
  - Pre-commit: `pnpm build`

- [ ] 12. RSS Feed + Sitemap Integration

  **What to do**:
  - Create `src/pages/rss.xml.ts`:
    - Import `rss` from `@astrojs/rss`
    - Import `getCollection` from `astro:content`
    - Fetch all blog posts, sort by `pubDate` descending
    - Generate RSS feed with:
      - `title`: site title
      - `description`: site description
      - `site`: `import.meta.env.SITE`
      - Items: each post with `title`, `description`, `pubDate`, `link: /blog/${post.id}/` (using `id`, NOT `slug`)
  - Verify `@astrojs/sitemap` is properly configured in `astro.config.mjs` (from T1):
    - Should auto-generate sitemap from all static pages
  - Update Footer (from T5) to include RSS feed link: `<a href="/rss.xml">RSS</a>`

  **Must NOT do**:
  - Do NOT use `slug` in RSS links — use `id`
  - Do NOT add Atom feed (just RSS)
  - Do NOT add JSON Feed
  - Do NOT manually create sitemap — let the integration handle it

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file for RSS, sitemap already configured, minor footer update
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T10, T11, T13 in Wave 3)
  - **Parallel Group**: Wave 3 (with Tasks 10, 11, 13)
  - **Blocks**: T14
  - **Blocked By**: T4

  **References**:

  **External References**:
  - Astro RSS: `https://docs.astro.build/en/guides/rss/` — `@astrojs/rss` package, endpoint creation
  - Astro Sitemap: `https://docs.astro.build/en/guides/integrations-guide/sitemap/` — Auto-generation from routes

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: RSS feed is valid XML with blog entries
    Tool: Bash (curl)
    Preconditions: `pnpm build` complete, `pnpm preview` running
    Steps:
      1. Run `curl -s http://localhost:4321/rss.xml`
      2. Assert response starts with `<?xml` declaration
      3. Assert response contains `<rss` root element
      4. Assert response contains at least 2 `<item>` elements (matching sample posts)
      5. Assert each `<item>` has `<title>`, `<link>`, `<pubDate>`, `<description>`
      6. Assert `<link>` values use `/blog/` path prefix (not /slug/)
    Expected Result: Valid RSS XML with all blog posts as items
    Failure Indicators: Invalid XML, missing items, wrong link format
    Evidence: .sisyphus/evidence/task-12-rss-feed.xml

  Scenario: Sitemap is generated
    Tool: Bash (curl)
    Preconditions: `pnpm build` complete, `pnpm preview` running
    Steps:
      1. Run `curl -s http://localhost:4321/sitemap-index.xml`
      2. Assert response contains XML with sitemap references
      3. Verify sitemap includes URLs for: /, /about/, /tags/, /blog/[post-ids]/
    Expected Result: Sitemap XML generated with all page URLs
    Failure Indicators: 404 response, empty sitemap, missing pages
    Evidence: .sisyphus/evidence/task-12-sitemap.xml
  ```

  **Commit**: YES (groups with T13)
  - Message: `feat: add RSS feed, sitemap, and social meta tags`
  - Files: `src/pages/rss.xml.ts`, `src/components/Footer.astro` (updated)
  - Pre-commit: `pnpm build`

- [ ] 13. Social Meta Tags (Open Graph + Twitter Card) on All Pages

  **What to do**:
  - Update `BaseLayout.astro` to include OG + Twitter Card meta tags in `<head>`:
    - `<meta property="og:type" content="website">` (or "article" for blog posts)
    - `<meta property="og:title" content={title}>`
    - `<meta property="og:description" content={description}>`
    - `<meta property="og:url" content={Astro.url}>`
    - `<meta property="og:site_name" content="blog.schaermu.ch">`
    - `<meta property="og:image" content={image}>` (hero image for posts, default image for pages)
    - `<meta name="twitter:card" content="summary_large_image">`
    - `<meta name="twitter:title" content={title}>`
    - `<meta name="twitter:description" content={description}>`
    - `<meta name="twitter:image" content={image}>`
  - Blog posts pass their hero image (if present) as the `image` prop to `BaseLayout`
  - Pages without a specific image use a default OG image (can be a simple placeholder in `public/`)
  - Create a default OG image in `public/og-default.png` (simple branded placeholder)
  - Use `Astro.site` + `Astro.url.pathname` for canonical URLs

  **Must NOT do**:
  - Do NOT add JSON-LD structured data
  - Do NOT add canonical tags (OG meta is sufficient)
  - Do NOT add breadcrumb schema
  - Do NOT over-engineer — standard OG + Twitter Card tags only

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Adding meta tags to existing layout — well-defined, straightforward
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T10, T11, T12 in Wave 3)
  - **Parallel Group**: Wave 3 (with Tasks 10, 11, 12)
  - **Blocks**: T14
  - **Blocked By**: T6, T7, T8, T9

  **References**:

  **External References**:
  - Open Graph protocol: `https://ogp.me/` — Standard OG meta tags
  - Twitter Card tags: `https://developer.x.com/en/docs/twitter-for-websites/cards/overview/abouts-cards`
  - Astro.url and Astro.site: `https://docs.astro.build/en/reference/api-reference/#astrourl`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Blog post has correct OG + Twitter meta tags
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: All pages built, dev server running
    Steps:
      1. Navigate to a blog post page
      2. Assert `meta[property="og:title"]` exists with post title
      3. Assert `meta[property="og:description"]` exists with post description
      4. Assert `meta[property="og:type"]` contains "article"
      5. Assert `meta[property="og:image"]` exists with non-empty content
      6. Assert `meta[name="twitter:card"]` equals "summary_large_image"
      7. Assert `meta[name="twitter:title"]` exists
    Expected Result: All OG and Twitter Card meta tags present with correct values
    Failure Indicators: Missing meta tags, empty content attributes
    Evidence: .sisyphus/evidence/task-13-og-tags-post.txt

  Scenario: Static pages have OG meta tags with default image
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321/about/
      2. Assert `meta[property="og:title"]` exists
      3. Assert `meta[property="og:image"]` contains "og-default" or similar default image path
      4. Navigate to http://localhost:4321/tags/
      5. Assert `meta[property="og:title"]` exists
    Expected Result: OG meta present on all pages with appropriate image fallback
    Failure Indicators: Missing OG tags on non-blog pages
    Evidence: .sisyphus/evidence/task-13-og-tags-pages.txt
  ```

  **Commit**: YES (groups with T12)
  - Message: `feat: add RSS feed, sitemap, and social meta tags`
  - Files: `src/layouts/BaseLayout.astro` (updated), `public/og-default.png`

- [ ] 14. GitHub Actions Deployment Workflow

  **What to do**:
  - Create `.github/workflows/deploy.yml` with:
    - Trigger on push to `main` branch
    - Use `actions/checkout@v5`
    - Use `withastro/action@v5` for build (configured for pnpm)
    - Use `actions/deploy-pages@v4` for deployment
    - Set `permissions: pages: write, id-token: write, contents: read`
    - Use `environment: github-pages` with `url: ${{ steps.deployment.outputs.page_url }}`
  - Verify `public/CNAME` exists with `blog.schaermu.ch` (already created in T1)
  - Verify `astro.config.ts` has `site: 'https://blog.schaermu.ch'` and `output: 'static'` (already set in T1)
  - Verify `base` is NOT set in astro config (custom domain = root path)

  **Must NOT do**:
  - Do NOT use `withastro/action@v2` (outdated)
  - Do NOT use `actions/deploy-pages@v1` or v2
  - Do NOT hardcode Node version — let `withastro/action` handle it
  - Do NOT add build steps separate from `withastro/action` (it handles install + build + upload)
  - Do NOT add unnecessary caching — `withastro/action` handles pnpm caching internally

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file creation with well-known GitHub Actions patterns, no complex logic
  - **Skills**: []
    - No skills needed — standard YAML workflow file
  - **Skills Evaluated but Omitted**:
    - `playwright-cli`: No browser testing needed for CI config

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 15)
  - **Blocks**: Final Verification Wave
  - **Blocked By**: T1 (scaffold — needs `public/CNAME` and `astro.config.ts` to exist)

  **References**:

  **Pattern References**:
  - `astro.config.ts` (created in T1) — verify `site` and `output: 'static'` are set
  - `public/CNAME` (created in T1) — verify contains `blog.schaermu.ch`

  **External References**:
  - Astro deployment docs: https://docs.astro.build/en/guides/deploy/github/
  - `withastro/action@v5`: https://github.com/withastro/action — handles pnpm detection, build, artifact upload
  - `actions/deploy-pages@v4`: https://github.com/actions/deploy-pages

  **WHY Each Reference Matters**:
  - `astro.config.ts`: Deployment requires `site` to be set for canonical URLs, sitemaps, RSS
  - `withastro/action`: This single action replaces separate install/build/upload steps — follow its conventions
  - `public/CNAME`: GitHub Pages requires this for custom domain; must survive build (Astro copies `public/` to `dist/`)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Workflow file is valid YAML with correct structure
    Tool: Bash
    Preconditions: .github/workflows/deploy.yml exists
    Steps:
      1. Run `cat .github/workflows/deploy.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin); print('VALID')"` to validate YAML
      2. Run `grep -c 'withastro/action@v5' .github/workflows/deploy.yml` — expect `1`
      3. Run `grep -c 'actions/deploy-pages@v4' .github/workflows/deploy.yml` — expect `1`
      4. Run `grep -c 'actions/checkout@v5' .github/workflows/deploy.yml` — expect `1`
      5. Run `grep 'push:' .github/workflows/deploy.yml` — expect match (trigger exists)
      6. Run `grep 'main' .github/workflows/deploy.yml` — expect match (branch filter)
    Expected Result: Valid YAML, all required actions at correct versions, triggered on push to main
    Failure Indicators: YAML parse error, wrong action versions, missing trigger
    Evidence: .sisyphus/evidence/task-14-workflow-valid.txt

  Scenario: CNAME and site config are deployment-ready
    Tool: Bash
    Preconditions: Project scaffolded (T1 complete)
    Steps:
      1. Run `cat public/CNAME` — expect exactly `blog.schaermu.ch`
      2. Run `grep "site:" astro.config.ts` — expect `https://blog.schaermu.ch`
      3. Run `grep "output:" astro.config.ts` — expect `static`
      4. Run `! grep "base:" astro.config.ts` — expect no match (no base path for custom domain)
    Expected Result: CNAME correct, site URL set, static output, no base path
    Failure Indicators: Wrong domain in CNAME, missing site config, base path set
    Evidence: .sisyphus/evidence/task-14-deploy-config.txt

  Scenario: Build succeeds and produces deployable output
    Tool: Bash
    Preconditions: All implementation tasks (T1-T13, T15) complete
    Steps:
      1. Run `pnpm build` — expect exit code 0
      2. Run `ls dist/` — expect index.html and other files
      3. Run `cat dist/CNAME` — expect `blog.schaermu.ch` (copied from public/)
    Expected Result: Clean build, dist/ contains site + CNAME
    Failure Indicators: Build errors, missing CNAME in dist/
    Evidence: .sisyphus/evidence/task-14-build-output.txt
  ```

  **Commit**: YES
  - Message: `ci: add GitHub Actions deployment workflow for GitHub Pages`
  - Files: `.github/workflows/deploy.yml`
  - Pre-commit: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"`

- [ ] 15. View Transitions — Animations and Persistence

  **What to do**:
  - `<ClientRouter />` is already included in BaseLayout (T5) — this task adds transition polish
  - Add `transition:animate` directives to BaseLayout and pages:
    - Page-level: `transition:animate="fade"` on `<main>` in BaseLayout
    - Blog post pages: `transition:animate="slide"` on the article content
    - Persistent elements: `transition:persist` on ThemeToggle component
  - Add `transition:name` directives for shared element transitions:
    - `transition:name="post-title"` on post titles in listing AND post page (enables title morph)
    - `transition:name="post-hero"` on hero images in listing cards AND post page (enables image morph)
  - Add `astro:before-swap` event listener in BaseLayout `<script is:inline>` to persist dark mode across navigations:
    ```
    document.addEventListener('astro:before-swap', (e) => {
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      e.newDocument.documentElement.classList.toggle('dark', theme === 'dark');
    });
    ```
  - Add `astro:after-swap` event listener to re-apply theme from localStorage (backup for edge cases):
    ```
    document.addEventListener('astro:after-swap', () => {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    });
    ```
  - Ensure Pagefind modal survives view transitions — if using `transition:persist` on the search container, verify the modal reopens correctly after navigation

  **Must NOT do**:
  - Do NOT use `<ViewTransitions />` (deprecated in Astro v6, replaced by `<ClientRouter />`)
  - Do NOT add scroll-driven animations or complex keyframe animations
  - Do NOT add transition animations to the ThemeToggle (use `transition:persist` instead)
  - Do NOT add `transition:name` to elements that don't have a matching counterpart on the destination page

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires understanding of Astro's View Transitions API, theme persistence across navigations, and careful coordination of `transition:name` across multiple files
  - **Skills**: [`playwright-cli`]
    - `playwright-cli`: Need to visually verify transition animations work and theme persists across navigation
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Transitions are functional, not design — animation choices already specified

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 14)
  - **Blocks**: Final Verification Wave
  - **Blocked By**: T5 (BaseLayout), T6 (ThemeToggle), T7 (post page), T8 (blog listing), T11 (Pagefind)

  **References**:

  **Pattern References**:
  - `src/layouts/BaseLayout.astro` (T5) — `<ClientRouter />` already in `<head>`, add `transition:animate` to `<main>`
  - `src/components/ThemeToggle.astro` (T6) — add `transition:persist` directive
  - `src/pages/blog/[id].astro` (T7) — add `transition:name="post-title"` and `transition:name="post-hero"` to post title/image
  - `src/components/PostCard.astro` (T8) — add matching `transition:name="post-title"` and `transition:name="post-hero"` to listing card elements

  **External References**:
  - Astro View Transitions guide: https://docs.astro.build/en/guides/view-transitions/
  - `<ClientRouter />` API: https://docs.astro.build/en/reference/modules/astro-transitions/#clientrouter-
  - `transition:animate` options: `fade`, `slide`, `none`, or custom
  - `transition:persist`: https://docs.astro.build/en/reference/directives-reference/#transitionpersist
  - `astro:before-swap` / `astro:after-swap`: https://docs.astro.build/en/guides/view-transitions/#lifecycle-events

  **WHY Each Reference Matters**:
  - `BaseLayout.astro`: Central place for page-level transition + swap event listeners
  - `ThemeToggle.astro`: Must persist across navigations to avoid flickering/resetting
  - `[id].astro` + `PostCard.astro`: Matching `transition:name` values create the shared element morph effect
  - Lifecycle events: `before-swap` is the ONLY reliable way to persist dark mode class across view transitions

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Page transitions animate on navigation
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Dev server running, site has multiple pages
    Steps:
      1. Navigate to http://localhost:4321/
      2. Click first blog post link
      3. Wait for navigation to complete (URL changes to /blog/*)
      4. Assert page content loaded (article element visible)
      5. Click browser back button or site header link to return to home
      6. Assert blog listing is visible again
    Expected Result: Smooth fade/slide transitions between pages, no hard reload flash
    Failure Indicators: Hard page reloads (full white flash), no animation visible, broken navigation
    Evidence: .sisyphus/evidence/task-15-page-transitions.png

  Scenario: Dark mode persists across view transitions
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321/
      2. Click the theme toggle to switch to dark mode
      3. Assert `html` element has class `dark`
      4. Click a blog post link to navigate
      5. Wait for navigation to complete
      6. Assert `html` element STILL has class `dark`
      7. Navigate to /about/
      8. Assert `html` element STILL has class `dark`
      9. Take screenshot showing dark mode on /about/ page
    Expected Result: Dark mode class persists on `<html>` across ALL view transitions
    Failure Indicators: `dark` class lost after navigation, theme flicker/flash during transition
    Evidence: .sisyphus/evidence/task-15-theme-persistence.png

  Scenario: Theme toggle component persists across navigations
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:4321/
      2. Locate theme toggle button — assert it exists
      3. Click a navigation link (e.g., /about/)
      4. Wait for navigation
      5. Assert theme toggle button STILL exists and is in the same visual state
      6. Toggle theme — assert it works correctly after navigation
    Expected Result: ThemeToggle component persists (not re-mounted), stays functional
    Failure Indicators: Toggle disappears during transition, loses state, or becomes non-functional
    Evidence: .sisyphus/evidence/task-15-toggle-persist.png

  Scenario: Shared element transitions on blog post navigation
    Tool: playwright-cli skill (NOT playwright MCP)
    Preconditions: Dev server running, at least 1 blog post with hero image
    Steps:
      1. Navigate to http://localhost:4321/
      2. Identify a post card with hero image
      3. Note the `transition:name` attribute value on the card's title/image (or `style` containing `view-transition-name`)
      4. Click the post card
      5. Wait for navigation to /blog/{id}
      6. Assert the post page's title/hero image has matching `view-transition-name` style
    Expected Result: Matching transition names on source and destination enable shared element morphing
    Failure Indicators: No `view-transition-name` styles, mismatched names between listing and detail
    Evidence: .sisyphus/evidence/task-15-shared-transitions.txt
  ```

  **Commit**: YES
  - Message: `feat: add view transition animations and theme persistence across navigations`
  - Files: `src/layouts/BaseLayout.astro` (updated), `src/components/ThemeToggle.astro` (updated), `src/pages/blog/[id].astro` (updated), `src/components/PostCard.astro` (updated)

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm build`. Review all files for: `as any`/`@ts-ignore`, empty catches, `console.log` in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Verify no `tailwind.config.js` exists. Verify `@astrojs/tailwind` is NOT in dependencies. Verify no `slug` references in routing code.
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright-cli` skill, **NOT** playwright MCP)
  Start from clean state (`pnpm build && pnpm preview`). Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: dark mode + search modal, view transitions + theme persistence, hero image rendering in both themes. Test edge cases: empty search, post without hero image, tag with single post. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual files created. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance: no extra layouts, no pagination, no comment system, no analytics, no JSON-LD, no `tailwind.config.js`, no `@astrojs/tailwind`. Detect unaccounted files. Flag anything not in the plan.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| After Task(s) | Commit Message | Pre-commit Check |
|---------------|---------------|-----------------|
| T1 | `feat: scaffold Astro v6 project with Tailwind v4 and deps` | `pnpm build` |
| T2-T4 | `feat: add design system, content collection, and sample posts` | `pnpm build` |
| T5-T9 | `feat: implement all page layouts and routes` | `pnpm build` |
| T10-T11 | `feat: add dark/light mode and Pagefind search` | `pnpm build` |
| T12-T13 | `feat: add RSS feed, sitemap, and social meta tags` | `pnpm build` |
| T14-T15 | `feat: add GitHub Pages deployment and View Transitions` | `pnpm build` |

---

## Success Criteria

### Verification Commands
```bash
pnpm build                          # Expected: exit 0, dist/ created
ls dist/index.html                  # Expected: exists (blog listing)
ls dist/blog/*/index.html           # Expected: 2 post pages
ls dist/tags/index.html             # Expected: exists (tag listing)
ls dist/tags/*/index.html           # Expected: tag detail pages
ls dist/about/index.html            # Expected: exists
ls dist/404.html                    # Expected: exists
ls dist/rss.xml                     # Expected: exists
ls dist/sitemap-index.xml           # Expected: exists
ls dist/pagefind/                   # Expected: pagefind index files
ls dist/CNAME                       # Expected: contains blog.schaermu.ch
```

### Final Checklist
- [ ] All "Must Have" items present and verified
- [ ] All "Must NOT Have" items absent from codebase
- [ ] `pnpm build` succeeds with zero warnings
- [ ] Dark/light mode works with toggle, persists across navigation
- [ ] Pagefind modal opens with Cmd+K, searches, navigates
- [ ] RSS feed valid with blog entries
- [ ] Social meta tags on all pages
- [ ] GitHub Actions workflow present and valid
