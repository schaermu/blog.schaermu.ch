import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.string().optional(),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      seriesOrder: z.number().int().positive().optional(),
      seriesTitle: z.string().optional(),
      testFixture: z.boolean().default(false),
    })
    .refine(
      (data) =>
        !data.series ||
        (data.seriesOrder !== undefined && data.seriesTitle !== undefined),
      {
        message: 'seriesOrder and seriesTitle are required when series is set',
      },
    ),
});

export const collections = { blog };
