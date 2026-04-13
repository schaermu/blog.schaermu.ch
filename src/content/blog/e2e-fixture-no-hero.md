---
title: "E2E Fixture Post Without Hero"
description: "A test fixture post without a hero image, used for E2E testing of hero absence and series navigation."
pubDate: 2020-01-01
tags: ["e2e-astro", "e2e-typescript", "e2e-tutorial"]
series: "e2e-test-series"
seriesOrder: 2
seriesTitle: "E2E Test Series"
testFixture: true
---

## Fixture post without hero

This companion fixture is designed to validate pages that do not expose a hero image. It uses the same synthetic series so tests can move between entries and assert shared navigation behavior. The content stays simple on purpose, yet it still provides a heading, a descriptive paragraph, and enough prose to resemble a normal blog article.

The goal is to make sure the absence of a hero image is handled gracefully and consistently. That includes layout spacing, fallback metadata, and any conditional components that depend on the frontmatter shape. Keeping the text static ensures the E2E assertions remain deterministic across runs.

```ts
const fixture = {
  kind: "e2e",
  hero: false,
};
```
