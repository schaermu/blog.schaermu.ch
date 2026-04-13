# Decisions — astro-blog

## Architecture Decisions
- Site: https://blog.schaermu.ch (NO `base` config in astro)
- Output: static
- 2 layouts only: BaseLayout.astro + BlogPostLayout.astro
- No pagination on any page
- Inline reading time: `Math.ceil(body.split(/\s+/).length / 200)` min read
- Dark mode via `data-theme` attribute on `<html>` (NOT class-based)
- Pagefind Component UI (NOT legacy Default UI)
- Dev mode search: stale index strategy (build once)
- Hero images in `src/assets/blog/`
- Default OG image: `public/og-default.png`
