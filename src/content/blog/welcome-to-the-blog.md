---
title: "Welcome to My Blog"
description: "An introduction to this blog built with Astro, Tailwind CSS, and a focus on simple, fast publishing."
pubDate: 2026-01-15
heroImage: "../../assets/blog/hero-welcome.svg"
tags: ["blogging", "astro", "web-dev"]
---

Welcome! I finally set up the blog I kept putting off for months. I wanted something lightweight, easy to maintain, and pleasant to write in, so Astro felt like the right fit.

This first post is mostly a hello, but it also marks the start of a small experiment: can a content-first site stay fast without getting complicated? Astro gives me a good answer. I can write Markdown, keep pages mostly static, and only add JavaScript when I truly need it.

## Why Astro?

Astro makes a strong case for blogs:

1. It ships very little JavaScript by default.
2. Content Collections keep Markdown structured and predictable.
3. The routing model stays simple even as the site grows.

That balance matters to me. I want the blog to feel calm and readable, both for visitors and for future-me when I come back to it after a few weeks away.

## A tiny config example

```typescript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://blog.schaermu.ch',
  output: 'static',
});
```

Keeping the setup small makes it easier to reason about every part of the site.

## What comes next

I plan to write about web development, content workflows, and the tools I use while building things. Some posts will be short notes, others will go deeper into a topic when I have enough to say.

If you want to follow along, start with the tags page and see where the blog goes from here.
