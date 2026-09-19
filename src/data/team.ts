import { getCollection } from 'astro:content';
const members = (await getCollection('team')).sort((a, b) => a.data.order - b.data.order);
export const teamMembers = members
  .filter((p) => p.data.listed)
  .map(({ id, data }) => ({ ...data, slug: id, href: '/team/' + id }));
export const teamDetail = members.find((p) => !p.data.listed)!.data;
