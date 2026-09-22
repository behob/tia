import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist', 'client');
const expected = [
  'index.html',
  '404.html',
  'search/index.html',
  'spaces/apartments/index.html',
  'spaces/villas/index.html',
  'spaces/retail-spaces/index.html',
  'spaces/offices-workspaces/index.html',
  'spaces/restaurants-cafes/index.html',
  'spaces/hotels-resorts/index.html',
  'spaces/renovation-makeovers/index.html',
  'spaces/fit-out-custom-joinery/index.html',
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

const redirectsFile = join(distDir, '_redirects');
if (!existsSync(redirectsFile)) {
  console.error('Missing Cloudflare _redirects build output.');
  process.exit(1);
}

const redirects = new Map(
  readFileSync(redirectsFile, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [source, destination, status] = line.split(/\s+/);
      return [source, { destination, status }];
    }),
);

const redirectDestinations = new Map([
  ['/index-2', '/spaces/apartments/'],
  ['/index-3', '/spaces/villas/'],
  ['/index-4', '/spaces/retail-spaces/'],
  ['/index-5', '/spaces/offices-workspaces/'],
  ['/index-6', '/spaces/restaurants-cafes/'],
  ['/index-7', '/spaces/hotels-resorts/'],
  ['/index-8', '/spaces/renovation-makeovers/'],
  ['/index-9', '/spaces/fit-out-custom-joinery/'],
  ['/blog-single', '/blog/transform-your-home-with-the-modern-interior-design-tips/'],
  ['/blog-details', '/blog/transform-your-home-with-the-modern-interior-design-tips/'],
  [
    '/blog/transform-your-home-with-the-modern-interior-design-tips-2',
    '/blog/transform-your-home-with-the-modern-interior-design-tips/',
  ],
  [
    '/blog/transform-your-home-with-the-modern-interior-design-tips-3',
    '/blog/transform-your-home-with-the-modern-interior-design-tips/',
  ],
  [
    '/blog/transform-your-home-with-the-modern-interior-design-tips-4',
    '/blog/transform-your-home-with-the-modern-interior-design-tips/',
  ],
]);

for (const [source, destination] of redirectDestinations) {
  for (const route of [source, `${source}/`]) {
    const redirect = redirects.get(route);
    if (redirect?.destination !== destination || redirect.status !== '301') {
      console.error(`Invalid Cloudflare redirect: ${route} -> ${destination} 301`);
      process.exit(1);
    }
  }

  if (!existsSync(join(distDir, destination, 'index.html'))) {
    console.error(`Missing Cloudflare redirect destination: ${destination}`);
    process.exit(1);
  }
}

console.log(
  `Route audit passed for ${expected.length} expected outputs and ${redirectDestinations.size * 2} Cloudflare redirects.`,
);
