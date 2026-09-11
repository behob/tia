import { mkdirSync, writeFileSync, existsSync, statSync, createReadStream } from 'node:fs';
import { join, extname } from 'node:path';
import http from 'node:http';

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

let baseURL = process.env.VISUAL_BASE_URL;
let localServer = null;

if (!baseURL) {
  const distDir = join(process.cwd(), 'dist', 'client');
  if (!existsSync(distDir)) {
    console.error('Build output missing. Please run "npm run build" before capturing screenshots without VISUAL_BASE_URL.');
    process.exit(1);
  }

  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.webmanifest': 'application/manifest+json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.ico': 'image/x-icon',
  };

  const resolveFile = (pathname) => {
    let clean = decodeURIComponent(pathname.split('?')[0]);
    if (clean.endsWith('/')) clean += 'index.html';
    let target = join(distDir, clean);
    if (existsSync(target) && statSync(target).isDirectory()) {
      target = join(target, 'index.html');
    }
    if (!existsSync(target) && existsSync(target + '.html')) {
      target = target + '.html';
    }
    if (!existsSync(target) && existsSync(join(target, 'index.html'))) {
      target = join(target, 'index.html');
    }
    return existsSync(target) && statSync(target).isFile() ? target : null;
  };

  localServer = http.createServer((req, res) => {
    const file = resolveFile(req.url || '/');
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found: ' + req.url);
    }
    const ext = extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });

  await new Promise((resolve) => {
    localServer.listen(0, () => {
      const port = localServer.address().port;
      baseURL = `http://127.0.0.1:${port}`;
      console.log(`Started local static server for visual capture at ${baseURL}`);
      resolve();
    });
  });
}

try {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const url = new URL(route, baseURL).href;
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForLoadState('networkidle').catch(() => {});
    } catch (err) {
      console.warn(`Warning loading ${url}: ${err.message}`);
    }

    // Dismiss preloader to snapshot actual page contents
    await page.evaluate(() => {
      const preloader = document.querySelector('.preloader');
      if (preloader) preloader.style.display = 'none';
    });

    await page.waitForTimeout(300);

    const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
    await page.screenshot({ path: join(artifactDir, `${name}.png`), fullPage: true });
    console.log(`[${i + 1}/${routes.length}] Captured ${route} -> ${name}.png`);
  }

  await browser.close();
  console.log(`Captured ${routes.length} visual snapshots.`);
} finally {
  if (localServer) {
    localServer.close();
  }
}
