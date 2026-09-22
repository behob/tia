import assert from 'node:assert/strict';
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from '@playwright/test';
const root = resolve('dist/client');
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
const server = createServer((req, res) => {
  let file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + sep) && file !== root) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  const status = existsSync(file) ? 200 : 404;
  if (status === 404) file = join(root, '404.html');
  res.writeHead(status, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
mkdirSync('.astro/site-verification', { recursive: true });
const browser = await chromium.launch();
let errors = [];
try {
  const context = await browser.newContext();
  await context.route('**/*', (route) =>
    new URL(route.request().url()).origin === base ? route.continue() : route.abort(),
  );
  const page = await context.newPage();
  await page.addInitScript(() => {
    const callbacks = new Map();
    let nextWidget = 0;
    window.turnstile = {
      render(container, options) {
        const id = `browser-test-widget-${++nextWidget}`;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'cf-turnstile-response';
        container.dataset.browserTestWidget = id;
        container.appendChild(input);
        callbacks.set(id, options.callback);
        options.callback('browser-test-token');
        return id;
      },
      reset(id) {
        const container = document.querySelector(`[data-browser-test-widget="${id}"]`);
        const input = container?.querySelector('input[name="cf-turnstile-response"]');
        if (input) input.value = '';
        callbacks.get(id)?.('browser-test-token');
      },
    };
  });
  page.setDefaultTimeout(10000);
  page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [1440, 390]) {
    console.log(`Checking controls at ${width}px`);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + '/contact', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open search dialog' }).click();
    const dialog = page.getByRole('dialog', { name: 'Search the website' });
    await dialog.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    assert.equal(
      await page.getByRole('button', { name: 'Open search dialog' }).evaluate((el) => el === document.activeElement),
      true,
    );
    if (width === 390) {
      await page.getByRole('button', { name: 'Open navigation menu' }).click();
      const nav = page.getByRole('dialog', { name: 'Navigation', exact: true });
      await nav.waitFor({ state: 'visible' });
      await page.keyboard.press('Shift+Tab');
      assert.equal(await nav.evaluate((el) => el.contains(document.activeElement)), true);
      await page.keyboard.press('Escape');
      assert.equal(
        await page.getByRole('button', { name: 'Open navigation menu' }).getAttribute('aria-expanded'),
        'false',
      );
    }
    await page.goto(base + '/search?q=lighting', { waitUntil: 'networkidle' });
    const results = page.locator('[data-search-item]:visible');
    assert((await results.count()) > 0);
    for (const text of await results.allTextContents()) assert(text.toLowerCase().includes('lighting'));
    await page.locator('#site-query').fill('zzzz-no-matching-title');
    assert(await page.locator('[data-search-empty]').isVisible());
    await page.goto(base + '/contact', { waitUntil: 'networkidle' });
    await page.route('**/api/mail', (route) =>
      route.fulfill({ status: 400, body: 'Please complete the security check.' }),
    );
    await page.getByLabel('Full Name').fill('Test Visitor');
    await page.getByLabel('Phone *', { exact: true }).fill('+971500000000');
    await page.getByLabel('Email *', { exact: true }).fill('visitor@example.test');
    await page.getByLabel('Message *', { exact: true }).fill('A local browser test.');
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page
      .getByRole('status')
      .filter({ hasText: 'Please complete the security check.' })
      .waitFor()
      .catch(async (error) => {
        console.log({
          errors,
          feedback: await page.locator('.form-feedback').allTextContents(),
          invalid: await page.locator(':invalid').evaluateAll((nodes) => nodes.map((n) => n.outerHTML)),
        });
        throw error;
      });
    assert.equal(await page.getByLabel('Full Name').inputValue(), 'Test Visitor');
    await page.unroute('**/api/mail');
    await page.route('**/api/mail', (route) =>
      route.fulfill({ status: 200, body: 'Thank you! Your message has been sent.' }),
    );
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page.getByRole('status').filter({ hasText: 'Your message has been sent.' }).waitFor();
    assert.equal(await page.getByLabel('Full Name').inputValue(), '');
    await page.unroute('**/api/mail');
    await page.screenshot({ path: `.astro/site-verification/contact-${width}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(base, { waitUntil: 'networkidle' });
  const newsletter = page.locator('form[action="/api/newsletter"]').first();
  await newsletter.scrollIntoViewIfNeeded();
  assert.equal(await newsletter.locator('input[name="cf-turnstile-response"]').inputValue(), '');
  assert.equal(await newsletter.getByRole('button', { name: 'Subscribe to newsletter' }).isEnabled(), true);
  await page.route('**/api/newsletter', async (route) => {
    const body = new URLSearchParams(route.request().postData());
    assert.equal(body.get('cf-turnstile-response'), 'browser-test-token');
    await route.fulfill({ status: 200, body: 'Thank you! You are subscribed to the TIA Interior newsletter.' });
  });
  await newsletter.getByLabel('Email address for newsletter').fill('subscriber@example.test');
  await newsletter.getByRole('checkbox').check();
  await newsletter.getByRole('button', { name: 'Subscribe to newsletter' }).click();
  await newsletter.getByRole('status').filter({ hasText: 'You are subscribed' }).waitFor();
  assert.equal(await newsletter.getByLabel('Email address for newsletter').inputValue(), '');
  await page.unroute('**/api/newsletter');
  const routes = [
    '/',
    '/spaces/apartments',
    '/spaces/villas',
    '/spaces/retail-spaces',
    '/spaces/offices-workspaces',
    '/spaces/restaurants-cafes',
    '/spaces/hotels-resorts',
    '/spaces/renovation-makeovers',
    '/spaces/fit-out-custom-joinery',
    '/blog-grid',
    '/blog-list/2',
    '/blog-standard/2',
  ];
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1, `${route}: one primary heading`);
    assert(
      await page.locator('h1').evaluate((heading) => {
        for (let node = heading; node; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (Number(style.opacity) < 0.99 || style.visibility === 'hidden') return false;
        }
        return true;
      }),
      `${route}: primary heading must be visible immediately`,
    );
    assert.equal(await page.locator('img:not([width]),img:not([height])').count(), 0, `${route}: image dimensions`);
    assert((await page.locator('img[srcset]').count()) > 0, `${route}: responsive images`);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2),
      false,
      `${route}: horizontal overflow`,
    );
    await page.screenshot({
      path: `.astro/site-verification/${route === '/' ? 'home' : route.replaceAll('/', '_')}.png`,
      fullPage: false,
    });
  }
  await page.goto(base + '/blog-list/2');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://tiadecors.com/blog-grid/2');
  assert.equal(await page.locator('script[src^="/assets/js/"]').count(), 0);
  const post = 'four-ways-for-creating-extra-space-in-small-homes';
  await page.goto(base + '/blog/' + post);
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  assert(
    schemas
      .flatMap((s) => JSON.parse(s))
      .some((s) => s['@type'] === 'BlogPosting' && s.datePublished && s.dateModified),
  );
  assert.match(await page.locator('h1').textContent(), /Four Ways/);
  assert((await page.locator('.tag-list a').count()) > 0);
  await page.locator('.tag-list a').first().click();
  assert.match(page.url(), /\/blog\/tag\//);
  assert((await page.locator('.post-card').count()) > 0);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(base, { waitUntil: 'networkidle' });
  const carouselState = await page.locator('[aria-roledescription="carousel"]').evaluateAll((carousels) =>
    carousels.map((carousel) => {
      const slides = [...carousel.querySelectorAll(':scope > .swiper-wrapper > .swiper-slide')];
      const hidden = slides.filter((slide) => slide.getAttribute('aria-hidden') === 'true');
      return {
        label: carousel.getAttribute('aria-label'),
        exposed: slides.length - hidden.length,
        hiddenInert: hidden.every((slide) => slide.inert),
      };
    }),
  );
  assert.deepEqual(
    carouselState,
    [
      { label: 'Featured projects', exposed: 1, hiddenInert: true },
      { label: 'Client testimonials', exposed: 1, hiddenInert: true },
      { label: 'Client logos', exposed: 2, hiddenInert: true },
      { label: 'Design articles', exposed: 1, hiddenInert: true },
    ],
    'Mobile homepage carousels expose only visible slides',
  );
  assert.equal(
    await page.locator('[data-text-animation] .line').count(),
    0,
    'Mobile home must not split text into animation wrappers',
  );
  assert.equal(
    await page.locator('.reveal, .img-reveal, [data-text-animation], .fade-top, .slide-anim').evaluateAll(
      (elements) =>
        elements.filter((element) => {
          const style = getComputedStyle(element);
          return style.visibility === 'hidden' || Number(style.opacity) < 0.99;
        }).length,
    ),
    0,
    'Mobile home motion targets must render without hidden scroll states',
  );
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  await reduced.route('**/*', (route) =>
    new URL(route.request().url()).origin === base ? route.continue() : route.abort(),
  );
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await reducedPage.evaluate(() => Boolean(window.ScrollSmoother?.get?.())), false);
  assert.equal(await reducedPage.evaluate(() => Boolean(window.mainSlider?.autoplay?.running)), false);
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  await noJs.route('**/*', (route) =>
    new URL(route.request().url()).origin === base ? route.continue() : route.abort(),
  );
  const plain = await noJs.newPage();
  await plain.goto(base, { waitUntil: 'networkidle' });
  assert(await plain.locator('h1').isVisible());
  assert.equal(await plain.locator('.preloader').count(), 0);
  const hero = plain.locator('.hero-background img').first();
  assert.equal(await hero.getAttribute('loading'), 'eager');
  assert.equal(await hero.getAttribute('fetchpriority'), 'high');
  assert(await hero.evaluate((img) => img.complete && img.naturalWidth > 0));
  const missing = await plain.goto(base + '/this-page-does-not-exist');
  assert.equal(missing.status(), 404);
  assert.match(await plain.locator('h1').textContent(), /Page Not Found/);
  // Transfer-size budgets catch accidental reintroduction of global plugins.
  const home = readFileSync(join(root, 'index.html'), 'utf8');
  const legacy = [...home.matchAll(/<script[^>]*src="(\/assets\/js\/[^\"]+)"/g)].map((m) => m[1]);
  assert(legacy.length <= 15, `Home loads ${legacy.length} legacy scripts`);
  const bytes = legacy.reduce((total, src) => total + statSync(join(root, src)).size, 0);
  assert(bytes < 550000, `Home legacy JS exceeds 550 KB: ${bytes}`);
  assert.deepEqual(errors, [], 'Browser JavaScript errors');
  console.log(
    `Interaction audit passed: desktop/mobile search, menus, contact feedback, headings, responsive images, categories, canonical URLs, reduced motion and no-JS rendering. Home legacy JS: ${legacy.length} files / ${bytes} bytes.`,
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
