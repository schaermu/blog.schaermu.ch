# Learnings — idempotent-e2e-tests

## Key Conventions

### Environment Variable Pattern
- Use `process.env.INCLUDE_TEST_FIXTURES === 'true'` (exact string match)
- NEVER use `import.meta.env.INCLUDE_TEST_FIXTURES` — Astro v6 does NOT transform non-public vars

### getCollection Filter Pattern
```typescript
await getCollection('blog', ({ data }) => {
  return process.env.INCLUDE_TEST_FIXTURES === 'true' ? true : !data.testFixture;
});
```

### Schema Pattern
- Add `testFixture: z.boolean().default(false)` after `seriesTitle` field (line 16), before `.refine()` call
- Import: `z` from `astro/zod`

### Fixture Posts
- IDs (from filename): `e2e-fixture-with-hero`, `e2e-fixture-no-hero`
- Tags: `e2e-testing`, `e2e-astro`, `e2e-web-dev` (part 1), `e2e-astro`, `e2e-typescript`, `e2e-tutorial` (part 2)
- Series: `e2e-test-series`, `E2E Test Series`
- Dates: 2020-01-15 (part 1), 2020-01-01 (part 2)
- Hero SVG: `src/assets/blog/hero-e2e-fixture.svg`

### Tooling
- All commands: `mise exec -- pnpm ...`
- Test: `mise exec -- pnpm test:e2e`
- Build: `mise exec -- pnpm build`
- Test build: `INCLUDE_TEST_FIXTURES=true mise exec -- pnpm build`

### Project Structure
- Content: `src/content/blog/*.md`
- Assets: `src/assets/blog/`
- E2E tests: `tests/e2e/`
- Pages: `src/pages/`

### Task 1 Notes
- Filter all `getCollection('blog')` call sites inline with `process.env.INCLUDE_TEST_FIXTURES === 'true' ? true : !data.testFixture`.
- Keep the schema field `testFixture: z.boolean().default(false)` directly after `seriesTitle` and before `.refine()`.
