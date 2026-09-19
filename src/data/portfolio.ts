import { getCollection } from 'astro:content';
const projects = (await getCollection('portfolio')).sort((a,b) => a.data.order - b.data.order);
const list = (group: string) => projects.filter(p => p.data.listingGroup === group).map(({id,data}) => ({...data, href: '/portfolio/' + id}));
export const residentialProjects = list('residential');
export const commercialProjects = list('commercial');
export const hospitalityProjects = list('hospitality');
export const portfolioDetail = projects.find(p => p.data.listingGroup === 'legacy')!.data;
