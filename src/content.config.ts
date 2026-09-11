import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const imagePath = z.string().regex(/^\/assets\/img\/.+\.(webp|svg)$/);

const blog = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    date: z.string().min(1),
    category: z.string().min(1),
    image: imagePath,
    featured: z.boolean().optional(),
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
