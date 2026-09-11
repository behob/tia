import { existsSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist', 'client');
const expected = [
  'index.html',
  'about/index.html',
  'service/index.html',
  'service-2/index.html',
  'service-3/index.html',
  'service-details/index.html',
  'portfolio/index.html',
  'portfolio-2/index.html',
  'portfolio-3/index.html',
  'portfolio-details/index.html',
  'blog-grid/index.html',
  'blog-list/index.html',
  'blog-standard/index.html',
  'blog-single/index.html',
  'blog-details/index.html',
  'contact/index.html',
  'faq/index.html',
  'pricing/index.html',
  'team/index.html',
  'team-details/index.html',
  'gallery-1/index.html',
  'gallery-2/index.html',
  'shop/index.html',
  'shop-details/index.html',
  'coming-soon/index.html',
  'error-page/index.html',
  'index-2/index.html',
  'index-3/index.html',
  'index-4/index.html',
  'index-5/index.html',
  'index-6/index.html',
  'index-7/index.html',
  'index-8/index.html',
  'index-9/index.html',
  'robots.txt',
  'manifest.webmanifest',
  'sitemap-index.xml',
];

const missing = expected.filter((file) => !existsSync(join(distDir, file)));

if (missing.length > 0) {
  console.error(`Missing expected build outputs:\n${missing.join('\n')}`);
  process.exit(1);
}

console.log(`Route audit passed for ${expected.length} expected outputs.`);
