import assert from 'node:assert/strict';
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from '@playwright/test';
import { getBlogPageCount, getBlogArchiveHref, paginateBlogPosts } from '../src/data/blogPagination.ts';

// Exercise the boundaries where another archive route must be generated.
for (const count of [0, 1, 9, 10, 18, 19, 27, 28]) {
  const items = Array.from({ length: count }, (_, index) => index);
  const total = getBlogPageCount(count);
  assert.equal(total, Math.max(1, Math.ceil(count / 9)));
  const pages = Array.from({ length: total }, (_, index) => paginateBlogPosts(items, index + 1));
  assert.deepEqual(
    pages.flatMap((page) => page.posts),
    items,
  );
  assert(pages.every((page) => page.posts.length <= 9));
  if (count) assert(pages.at(-1).posts.length > 0);
  assert.throws(() => paginateBlogPosts(items, total + 1), RangeError);
}

const root = resolve('dist/client');
const posts = readdirSync('src/content/blog')
  .filter((file) => file.endsWith('.json'))
  .map((file) => ({
    slug: file.slice(0, -5),
    ...JSON.parse(readFileSync(join('src/content/blog', file), 'utf8')),
  }))
  .filter((post) => post.status !== 'draft' && post.date <= new Date().toISOString().slice(0, 10))
  .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order || a.slug.localeCompare(b.slug));
const pageCount = getBlogPageCount(posts.length);
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};
const server = http.createServer((req, res) => {
  let file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (file !== root && !file.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const screenshotDir = '.astro/blog-verification';
mkdirSync(screenshotDir, { recursive: true });
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  // Keep verification local and independent of third-party fonts/services.
  await page.route('**/*', (route) =>
    new URL(route.request().url()).origin === base ? route.continue() : route.abort(),
  );
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const view of ['grid', 'list', 'standard']) {
      for (let currentPage = 1; currentPage <= pageCount; currentPage++) {
        const expectedPosts = posts.slice((currentPage - 1) * 9, currentPage * 9);
        await page.goto(`${base}${getBlogArchiveHref(view, currentPage)}`, { waitUntil: 'networkidle' });
        await page.locator('.preloader').waitFor({ state: 'hidden' });
        const links = page.locator('#blog-posts .post-card .title a');
        assert.deepEqual(
          await links.allTextContents(),
          expectedPosts.map((post) => post.title),
          `${view} page ${currentPage}: latest posts first, nine per page`,
        );
        assert.deepEqual(
          await links.evaluateAll((elements) => elements.map((el) => el.getAttribute('href'))),
          expectedPosts.map((post) => `/blog/${post.slug}`),
        );
        const cards = page.locator('#blog-posts .post-card');
        for (const [index, post] of expectedPosts.entries()) {
          assert(
            (await cards.nth(index).locator('.post-meta').textContent()).includes(
              dateFormatter.format(new Date(`${post.date}T00:00:00Z`)),
            ),
          );
        }
        const pagination = page.getByRole('navigation', { name: 'Blog pagination', exact: true });
        if (pageCount > 1) {
          assert.equal(await pagination.locator('[aria-current="page"]').textContent(), String(currentPage));
          assert.equal(await pagination.locator('[rel="prev"]').count(), currentPage > 1 ? 1 : 0);
          assert.equal(await pagination.locator('[rel="next"]').count(), currentPage < pageCount ? 1 : 0);
        }
        for (const link of await links.all()) assert(await link.isVisible(), `${view}: hidden post`);
        assert.equal(
          await page
            .locator('.blog-view-toggle [aria-current="page"]')
            .textContent()
            .then((text) => text.trim()),
          view[0].toUpperCase() + view.slice(1),
        );
        const blogMenu = page
          .locator('header .mobile-menu-items > ul > li')
          .filter({ has: page.locator('a[href="/blog-grid"]') });
        assert.equal(await blogMenu.count(), 1);
        assert.equal(await blogMenu.locator('ul').count(), 0);
        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${view}: horizontal overflow at ${width}px`,
        );
        await page.screenshot({ path: `${screenshotDir}/${view}-${currentPage}-${width}.png` });
        // Test real navigation through the segmented view selector.
        const nextView = view === 'grid' ? 'list' : view === 'list' ? 'standard' : 'grid';
        const nextHref = getBlogArchiveHref(nextView, currentPage);
        await page.locator(`.blog-view-toggle a[href="${nextHref}"]`).click();
        await page.waitForURL(`**${nextHref}`);
        // Keyboard activation also verifies the pagination controls below long lists.
        if (pageCount > 1) {
          const targetPage = currentPage === 1 ? 2 : currentPage - 1;
          await page
            .getByRole('navigation', { name: 'Blog pagination', exact: true })
            .getByRole('link', { name: `Page ${targetPage}`, exact: true })
            .press('Enter');
          await page.waitForURL(`**${getBlogArchiveHref(nextView, targetPage)}`);
        }
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const post of posts) {
    await page.goto(`${base}/blog/${post.slug}`, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('.blog-details-wrap .post-content .title').textContent(), post.title);
    assert(
      (await page.locator('.blog-details-wrap .post-meta').textContent()).includes(
        dateFormatter.format(new Date(`${post.date}T00:00:00Z`)),
      ),
    );
    assert.equal(await page.locator('.blog-details-content > p').first().textContent(), post.intro);
    assert.equal(await page.locator('.blog-details .justify-content-center').count(), 1);
    const article = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((el) => JSON.parse(el.textContent).find((item) => item['@type'] === 'BlogPosting'));
    assert.equal(article.headline, post.title);
    for (const alias of post.aliases ?? []) {
      assert(
        readFileSync(join(root, 'blog', alias, 'index.html'), 'utf8').includes(`/blog/${post.slug}`),
        `Missing redirect: ${alias}`,
      );
    }
  }
  const modernSlug = 'transform-your-home-with-the-modern-interior-design-tips';
  for (const legacy of ['blog-single', 'blog-details']) {
    await page.goto(`${base}/${legacy}`);
    await page.waitForURL(`**/blog/${modernSlug}`);
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/blog/${modernSlug}`, { waitUntil: 'networkidle' });
    await page.locator('.preloader').waitFor({ state: 'hidden' });
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `Article overflow at ${width}px`,
    );
    await page.locator('.blog-details').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${screenshotDir}/single-${width}.png` });
  }
  // The view selector and article links must also work with scripts disabled.
  const noJs = await browser.newPage({ javaScriptEnabled: false });
  await noJs.goto(`${base}/blog-grid`);
  assert.equal(await noJs.locator('#blog-posts .post-card').count(), Math.min(9, posts.length));
  assert.equal(await noJs.locator('.blog-view-toggle a').count(), 3);
  if (pageCount > 1) {
    await noJs.goto(`${base}/blog-grid/2`);
    assert.equal(await noJs.locator('#blog-posts .post-card').count(), Math.min(9, posts.length - 9));
  }
  await noJs.close();
  console.log(
    `Blog audit passed: ${posts.length} posts across ${pageCount} pages, three views, desktop/mobile, pagination boundaries and navigation, dates, article metadata, and legacy redirects.`,
  );
  console.log(`Screenshots: ${screenshotDir}`);
} finally {
  await browser?.close();
  server.close();
}
