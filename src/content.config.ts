import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const imagePath = z
  .string()
  .regex(/^\/assets\/img\/.+\.(webp|svg)$/)
  .transform((value) => value as `/assets/img/${string}`);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    date: z.iso.date(),
    updatedDate: z.iso.date().optional(),
    status: z.enum(['draft', 'published']).default('published'),
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
  loader: glob({ pattern: '**/*.json', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string().min(1),
    category: z.string().min(1),
    image: imagePath,
    year: z.string().optional(),
    slug: z.string(),
    order: z.number().int(),
    listingGroup: z.enum(['residential', 'commercial', 'hospitality', 'legacy']),
    reviewStatus: z.enum(['pending', 'approved']),
    architect: z.string(),
    projectType: z.string(),
    client: z.string(),
    terms: z.string(),
    strategy: z.string(),
    date: z.string(),
    heroImage: imagePath,
    seoDescription: z.string(),
    description: z.string(),
    features: z.array(z.object({ title: z.string(), desc: z.string() })),
    roomSizes: z.array(z.object({ size: z.string(), label: z.string() })),
    resultDescription: z.string(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
  schema: z.object({
    title: z.string().min(1),
    desc: z.string().min(1),
    group: z.enum([
      'featureServices',
      'iconServices',
      'fitOutServices',
      'customFurnitureServices',
      'serviceDetailsFeatures',
    ]),
    order: z.number().int(),
    num: z.string().optional(),
    big: z.boolean().optional(),
    reviewStatus: z.enum(['pending', 'approved']),
    image: imagePath.optional(),
    icon: imagePath.optional(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/team' }),
  schema: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    image: imagePath,
    bio: z.string(),
    slug: z.string(),
    order: z.number().int(),
    listed: z.boolean(),
    reviewStatus: z.enum(['pending', 'approved']),
    professionalInfo: z.string(),
    expertiseDescription: z.string(),
    expertise: z.array(z.string()),
    skills: z.array(
      z.object({
        title: z.string(),
        width: z
          .string()
          .regex(/^\d{1,3}%$/)
          .transform((value) => value as `${number}%`),
      }),
    ),
  }),
});

const sectors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/sectors' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    legacyPath: z.string(),
    sections: z.array(z.string()).min(1),
  }),
});
export const collections = { blog, portfolio, services, team, sectors };
