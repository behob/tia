import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist', 'client');
const pages = [
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

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const failures = [];

for (const route of pages) {
  const file = htmlPath(route);
  try {
    assert(existsSync(file), `${route}: missing built HTML`);
    const html = readFileSync(file, 'utf8');
    assert(/<title>[^<]+<\/title>/.test(html), `${route}: missing title`);
    assert(/<meta name="description" content="[^"]+">/.test(html), `${route}: missing meta description`);
    assert(/<meta name="robots" content="[^"]+">/.test(html), `${route}: missing robots meta`);
    assert(/<link rel="canonical" href="https:\/\/tiadecors\.com\/[^"]*">/.test(html), `${route}: missing canonical`);
    assert(/<meta property="og:type" content="[^"]+">/.test(html), `${route}: missing og:type`);
    assert(/<meta property="og:image" content="https:\/\/tiadecors\.com\/assets\/img\/[^"]+\.webp">/.test(html), `${route}: missing og:image`);
    assert(!html.includes('undefined'), `${route}: contains undefined`);
    assert(!html.includes('content=""'), `${route}: contains empty meta content`);
    assert(!/\/assets\/img\/[^"')]+\.png/.test(html), `${route}: references legacy PNG image`);
    assert(/application\/ld\+json/.test(html), `${route}: missing JSON-LD`);
  } catch (error) {
    failures.push(error.message);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`SEO audit passed for ${pages.length} routes.`);
