import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const imagePath = z.string().regex(/^\/assets\/img\/.+\.(webp|svg)$/);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    date: z.string().min(1),
    category: z.string().min(1),
    image: imagePath,
    featured: z.boolean().optional(),
    order: z.number().int().nonnegative(),
    author: z.string().min(1),
    wideImage: imagePath.optional(),
    sidebarImage: imagePath.optional(),
    detailImage: imagePath.optional(),
    intro: z.string().min(1),
    sections: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })),
    gallery: z.array(imagePath),
    quote: z.object({ text: z.string().min(1), author: z.string().min(1) }).optional(),
    conclusion: z.object({ title: z.string().min(1), text: z.string().min(1) }).optional(),
    tags: z.array(z.string().min(1)),
    aliases: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).default([]),
    comments: z
      .array(
        z.object({
          author: z.string().min(1),
          image: imagePath,
          date: z.string().min(1),
          text: z.string().min(1),
        }),
      )
      .default([]),
  }),
});

const portfolio = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string().min(1),
    category: z.string().min(1),
    image: imagePath,
    year: z.string().optional(),
  }),
});

const services = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: imagePath.optional(),
    icon: imagePath.optional(),
  }),
});

const team = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    image: imagePath,
    bio: z.string().optional(),
  }),
});

export const collections = { blog, portfolio, services, team };
