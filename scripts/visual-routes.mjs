import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const routes = [
  '/',
  '/about',
  '/service',
  '/service-details',
  '/portfolio',
  '/portfolio-details',
  '/blog-grid',
  '/blog-details',
  '/contact',
  '/faq',
  '/gallery-1',
  '/gallery-2',
  '/shop',
  '/team',
  '/index-2',
  '/index-3',
  '/index-4',
  '/index-5',
  '/index-6',
  '/index-7',
  '/index-8',
  '/index-9',
];

const artifactDir = join(process.cwd(), '.astro', 'visual-regression');
mkdirSync(artifactDir, { recursive: true });
writeFileSync(join(artifactDir, 'routes.json'), JSON.stringify({ routes }, null, 2));

let playwright;
try {
  playwright = await import('@playwright/test');
} catch {
  console.log('Visual route manifest written. Install @playwright/test to capture screenshots.');
  process.exit(0);
}

const baseURL = process.env.VISUAL_BASE_URL;
if (!baseURL) {
  console.log('Visual route manifest written. Set VISUAL_BASE_URL to capture screenshots.');
  process.exit(0);
}

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

for (const route of routes) {
  const url = new URL(route, baseURL).href;
  await page.goto(url, { waitUntil: 'networkidle' });
  const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
  await page.screenshot({ path: join(artifactDir, `${name}.png`), fullPage: true });
}

await browser.close();
console.log(`Captured ${routes.length} visual snapshots.`);
