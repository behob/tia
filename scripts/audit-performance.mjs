import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { chromium } from '@playwright/test';

const getArgument = (name, fallback) => {
  const prefix = `--${name}=`;
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length) ?? fallback;
};

const baseUrl = new URL(getArgument('base-url', 'https://tiadecors.com'));
const runs = Number.parseInt(getArgument('runs', '3'), 10);
const outputPath = getArgument('output', '.astro/performance-baseline.json');
const routes = ['/', '/blog/transforming-spaces-into-dream-dwellings/', '/contact'];

if (!Number.isInteger(runs) || runs < 1 || runs > 10) {
  throw new Error('--runs must be an integer from 1 to 10.');
}

const round = (value, digits = 0) => Number(value.toFixed(digits));
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

const browser = await chromium.launch();
const pages = [];

try {
  for (const route of routes) {
    const samples = [];

    for (let run = 1; run <= runs; run += 1) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      page.setDefaultTimeout(45000);
      await page.addInitScript(() => {
        window.__performanceAudit = { cls: 0, lcp: 0, longTasks: [] };

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__performanceAudit.lcp = entry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__performanceAudit.cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__performanceAudit.longTasks.push({ duration: entry.duration, startTime: entry.startTime });
          }
        }).observe({ type: 'longtask', buffered: true });
      });

      const url = new URL(route, baseUrl).href;
      const response = await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(2500);

      const sample = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const fcp =
          performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint')?.startTime ??
          0;
        const resources = performance.getEntriesByType('resource').map((entry) => ({
          bytes: entry.transferSize || entry.encodedBodySize || 0,
          duration: entry.duration,
          initiatorType: entry.initiatorType,
          url: entry.name,
        }));
        const audit = window.__performanceAudit;

        return {
          cls: audit.cls,
          domContentLoadedMs: navigation.domContentLoadedEventEnd,
          fcpMs: fcp,
          lcpMs: audit.lcp,
          loadMs: navigation.loadEventEnd,
          longTaskBlockingTimeMs: audit.longTasks.reduce((total, entry) => total + Math.max(0, entry.duration - 50), 0),
          resourceBytes: resources.reduce((total, entry) => total + entry.bytes, 0),
          resourceCount: resources.length,
          topResources: resources.sort((a, b) => b.bytes - a.bytes).slice(0, 8),
          ttfbMs: navigation.responseStart,
        };
      });

      samples.push({ ...sample, run, status: response?.status() ?? null });
      await context.close();
    }

    const metricNames = [
      'ttfbMs',
      'fcpMs',
      'lcpMs',
      'cls',
      'longTaskBlockingTimeMs',
      'domContentLoadedMs',
      'loadMs',
      'resourceBytes',
      'resourceCount',
    ];
    const medians = Object.fromEntries(
      metricNames.map((name) => [name, round(median(samples.map((sample) => sample[name])), name === 'cls' ? 3 : 0)]),
    );
    const representative = samples.reduce((closest, sample) =>
      Math.abs(sample.lcpMs - medians.lcpMs) < Math.abs(closest.lcpMs - medians.lcpMs) ? sample : closest,
    );

    pages.push({
      route,
      url: new URL(route, baseUrl).href,
      medians,
      representativeTopResources: representative.topResources.map((resource) => ({
        ...resource,
        bytes: round(resource.bytes),
        duration: round(resource.duration),
        url: new URL(resource.url).pathname,
      })),
      samples: samples.map(({ topResources: _topResources, ...sample }) => ({
        ...sample,
        cls: round(sample.cls, 3),
        domContentLoadedMs: round(sample.domContentLoadedMs),
        fcpMs: round(sample.fcpMs),
        lcpMs: round(sample.lcpMs),
        loadMs: round(sample.loadMs),
        longTaskBlockingTimeMs: round(sample.longTaskBlockingTimeMs),
        resourceBytes: round(sample.resourceBytes),
        ttfbMs: round(sample.ttfbMs),
      })),
    });
  }
} finally {
  await browser.close();
}

const report = {
  capturedAt: new Date().toISOString(),
  methodology: {
    browser: 'Playwright bundled Chromium',
    cache: 'fresh browser context per run',
    cpuThrottling: 'none',
    fieldData: false,
    networkThrottling: 'none',
    runs,
    viewport: '390x844 at device scale factor 1, mobile/touch emulation',
  },
  pages,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

for (const page of pages) {
  const metrics = page.medians;
  console.log(
    `${page.route} — LCP ${metrics.lcpMs}ms, CLS ${metrics.cls}, blocking ${metrics.longTaskBlockingTimeMs}ms, ` +
      `${metrics.resourceCount} resources / ${(metrics.resourceBytes / 1024).toFixed(0)} KiB`,
  );
}
console.log(`Performance baseline written to ${outputPath}`);
