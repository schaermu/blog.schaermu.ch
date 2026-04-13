# Learnings — astro-blog

## Key Conventions (from plan)
- Tailwind v4: CSS-first, use `@theme` directive, `@custom-variant dark`, `@plugin "@tailwindcss/typography"`
- NO `tailwind.config.js` ever
- Astro v6 Content Layer: `id` NOT `slug` for routing
- Config file: `src/content.config.ts` (NOT `src/content/config.ts`)
- Use `render(entry)` from `astro:content` NOT `entry.render()`
- View Transitions: `<ClientRouter />` NOT deprecated `<ViewTransitions />`
- GitHub Actions: `withastro/action@v5`, `actions/deploy-pages@v4`, `actions/checkout@v5`
- Pagefind dark mode: CSS variable overrides `--pf-*` inside `[data-theme="dark"]` NOT `data-pf-theme`
- FOUC prevention: `<script is:inline>` in `<head>` before stylesheets
- Theme persistence: `astro:before-swap` event listener
- QA: Use `playwright-cli` skill ONLY, NOT playwright MCP
- Package manager: pnpm
- Blog post route: `src/pages/blog/[...id].astro` (catch-all for path-derived IDs)
