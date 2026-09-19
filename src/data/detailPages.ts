import { getCollection } from 'astro:content';
export const portfolioDetailPages = (await getCollection('portfolio')).filter(p => p.data.listingGroup !== 'legacy').sort((a,b) => a.data.order-b.data.order).map(({id,data}) => ({...data,slug:id}));
export const teamDetailPages = (await getCollection('team')).sort((a,b) => a.data.order-b.data.order).map(({id,data}) => ({...data,slug:id}));
export const getPortfolioDetailBySlug = (slug:string) => portfolioDetailPages.find(p => p.slug === slug);
export const getTeamDetailBySlug = (slug:string) => teamDetailPages.find(p => p.slug === slug);
// Compatibility for older hand-authored sections. New cards receive the stable href from their collection record.
export function getPortfolioHref(title:string, category?:string) { const p = portfolioDetailPages.find(p => p.title === title && (!category || p.category === category)) ?? portfolioDetailPages.find(p => p.title === title); return p ? '/portfolio/' + p.slug : '/portfolio'; }
export function getTeamHref(name:string) { const p = teamDetailPages.find(p => p.name === name); return p ? '/team/' + p.slug : '/team'; }
