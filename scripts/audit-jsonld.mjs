import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist', 'client');
const routes = [
  '/',
  '/about',
  '/service',
  '/service-2',
  '/service-3',
  '/service-details',
  '/portfolio',
  '/portfolio-2',
  '/portfolio-3',
  '/portfolio-details',
  '/blog-grid',
  '/blog-list',
  '/blog-standard',
  '/blog-single',
  '/blog-details',
  '/contact',
  '/faq',
  '/pricing',
  '/team',
  '/team-details',
  '/gallery-1',
  '/gallery-2',
  '/shop',
  '/shop-details',
  '/coming-soon',
  '/error-page',
  '/index-2',
  '/index-3',
  '/index-4',
  '/index-5',
  '/index-6',
  '/index-7',
  '/index-8',
  '/index-9',
];

function htmlPath(route) {
  return route === '/' ? join(distDir, 'index.html') : join(distDir, route.slice(1), 'index.html');
}

function flattenJsonLd(value) {
  return Array.isArray(value) ? value.flatMap(flattenJsonLd) : [value];
}

const requiredByType = {
  Article: ['headline', 'image', 'publisher', 'mainEntityOfPage'],
  BreadcrumbList: ['itemListElement'],
  CreativeWork: ['name', 'description', 'image', 'creator'],
  FAQPage: ['mainEntity'],
  LocalBusiness: ['name', 'url', 'telephone', 'email', 'address'],
  Organization: ['name', 'url', 'logo'],
  Service: ['name', 'description', 'provider', 'areaServed'],
  WebPage: ['url', 'name', 'description', 'isPartOf'],
  WebSite: ['url', 'name', 'publisher'],
};

const failures = [];
let objectCount = 0;

for (const route of routes) {
  const file = htmlPath(route);

  if (!existsSync(file)) {
    failures.push(`${route}: missing built HTML`);
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  if (scripts.length === 0) {
    failures.push(`${route}: missing JSON-LD script`);
    continue;
  }

  for (const [, rawJson] of scripts) {
    let parsed;

    try {
      parsed = JSON.parse(rawJson);
    } catch (error) {
      failures.push(`${route}: invalid JSON-LD (${error.message})`);
      continue;
    }

    for (const item of flattenJsonLd(parsed)) {
      objectCount += 1;
      const type = item?.['@type'];

      if (!item?.['@context']) {
        failures.push(`${route}: JSON-LD ${type ?? 'object'} missing @context`);
      }

      if (!type) {
        failures.push(`${route}: JSON-LD object missing @type`);
        continue;
      }

      for (const field of requiredByType[type] ?? []) {
        if (item[field] === undefined || item[field] === null || item[field] === '') {
          failures.push(`${route}: JSON-LD ${type} missing ${field}`);
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`JSON-LD audit passed for ${objectCount} structured data objects.`);
