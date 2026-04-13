---
title: "E2E Fixture Post With Hero"
description: "A test fixture post used for E2E testing. This post includes a hero image and is part of a series."
pubDate: 2020-01-15
heroImage: "../../assets/blog/hero-e2e-fixture.svg"
tags: ["e2e-testing", "e2e-astro", "e2e-web-dev"]
series: "e2e-test-series"
seriesOrder: 1
seriesTitle: "E2E Test Series"
testFixture: true
---

## Fixture post with hero

This fixture exists so E2E tests can render a predictable article page without depending on real editorial content. It includes a hero image, a stable series setup, and tags that are clearly synthetic. The text is intentionally plain, but it still gives the page enough body content to exercise typography, spacing, and metadata rendering in a realistic way.

The post also helps verify that content-independent navigation behaves the same across builds. Because the date is fixed in the past, it should remain stable in sorted listings and archives. That makes it a good target for repeatable checks, especially when tests need consistent anchors, links, and article headings.

```ts
const fixture = {
  kind: "e2e",
  hero: true,
};
```
