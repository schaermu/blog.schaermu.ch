---
title: "Building a Static Blog with Astro Content Collections"
description: "A practical look at Astro's content model, how to organize posts, and why type-safe Markdown is a great fit for blogs."
pubDate: 2026-02-03
tags: ["astro", "typescript", "tutorial"]
---

Astro Content Collections make a blog feel organized from day one. Instead of treating Markdown as loose files, you define a structure for posts and let the framework validate it for you.

That matters more than it sounds. Once a site has a few posts, small inconsistencies become annoying: missing dates, mismatched tag names, or frontmatter fields that drift over time. A collection gives you a clean contract.

## Defining the content shape

The basic idea is simple: define a schema, point it at your blog folder, and let Astro handle the rest.

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

This keeps your content predictable without making the authoring process painful.

## Querying posts

When you need a list of posts, Astro makes it straightforward to load them and sort them by date.

```typescript
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const latest = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
```

From there, it is easy to build index pages, tag pages, or related-post sections.

## Rendering a post page

For a dynamic blog route, you can map collection entries to static paths and render each entry on demand.

```typescript
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
```

That pattern keeps the page logic small and the content layer clean.

## Why this approach works

I like this setup because it scales gently. There is enough structure to prevent mess, but not so much that writing becomes tedious. For a personal blog, that is exactly the sweet spot I want.

In practice, it means I can focus on writing good posts instead of fighting the tooling.
