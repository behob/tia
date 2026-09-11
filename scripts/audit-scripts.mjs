import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist', 'client');
const expectedScriptRoutes = {
  '/assets/js/slider.js': ['/', '/index-2', '/index-3', '/index-9'],
  '/assets/js/banner-process.js': ['/index-2', '/index-3'],
  '/assets/js/contact.js': ['/contact'],
  '/assets/js/vendor/countdown.js': ['/coming-soon'],
};

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

const failures = [];

for (const route of routes) {
  const file = htmlPath(route);

  if (!existsSync(file)) {
    failures.push(`${route}: missing built HTML`);
    continue;
  }

  const html = readFileSync(file, 'utf8');

  for (const [script, allowedRoutes] of Object.entries(expectedScriptRoutes)) {
    const shouldLoad = allowedRoutes.includes(route);
    const doesLoad = html.includes(script);

    if (shouldLoad !== doesLoad) {
      failures.push(`${route}: ${script} expected ${shouldLoad ? 'present' : 'absent'}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Script route audit passed.');
