import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>['data'] & { slug: string; href: string };

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection('blog');
  return entries
    .map(({ id, data }) => ({ ...data, slug: id, href: getBlogHref(id) }))
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export function getBlogHref(slug: string) {
  return `/blog/${slug}`;
}

export const defaultBlogSlug = 'transform-your-home-with-the-modern-interior-design-tips';

export const blogCategories = [
  'Accessories',
  'Electrical & Lighting',
  'Home Appliance',
  'Power Tools',
  'Uncategorized',
  'Ware Accessories',
];
export const blogTags = [
  'Architecture',
  'Construction',
  'Furniture',
  'Design',
  'Interior',
  'Kitchen',
  'Living Room',
  'Building',
  'Planning',
];
