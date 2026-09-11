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

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? '';
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

const failures = [];

for (const route of routes) {
  const file = htmlPath(route);

  if (!existsSync(file)) {
    failures.push(`${route}: missing built HTML`);
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const ids = new Map();

  for (const match of html.matchAll(/\sid=(["'])(.*?)\1/g)) {
    const id = match[2];
    ids.set(id, (ids.get(id) ?? 0) + 1);
  }

  for (const [id, count] of ids.entries()) {
    if (count > 1) {
      failures.push(`${route}: duplicate id "${id}"`);
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const alt = attr(tag, 'alt');

    if (!/\salt=(["']).*?\1/i.test(tag)) {
      failures.push(`${route}: image missing alt attribute`);
    } else if (alt.trim().length === 0) {
      failures.push(`${route}: image has empty alt text`);
    }
  }

  for (const match of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const tag = match[0];
    const label = attr(tag, 'aria-label') || attr(tag, 'title') || stripTags(match[1]);

    if (!label) {
      failures.push(`${route}: button missing accessible name`);
    }
  }

  for (const match of html.matchAll(/<(input|textarea|select)\b[^>]*>/gi)) {
    const tag = match[0];
    const type = attr(tag, 'type').toLowerCase();

    if (type === 'hidden' || attr(tag, 'aria-hidden') === 'true') {
      continue;
    }

    const id = attr(tag, 'id');
    const hasLabel = id ? new RegExp(`<label\\b[^>]*\\sfor=(["'])${id}\\1`, 'i').test(html) : false;
    const hasAccessibleName = hasLabel || attr(tag, 'aria-label') || attr(tag, 'aria-labelledby') || attr(tag, 'placeholder');

    if (!hasAccessibleName) {
      failures.push(`${route}: form control missing accessible name`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Accessibility audit passed for ${routes.length} routes.`);
