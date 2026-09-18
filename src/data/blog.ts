import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>['data'] & { slug: string; href: string; publishedDate: string };

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection('blog');
  return entries
    .map(({ id, data }) => ({
      ...data,
      slug: id,
      href: getBlogHref(id),
      publishedDate: data.date,
      date: dateFormatter.format(new Date(`${data.date}T00:00:00Z`)),
    }))
    .sort(
      (a, b) => b.publishedDate.localeCompare(a.publishedDate) || a.order - b.order || a.slug.localeCompare(b.slug),
    );
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
