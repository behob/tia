import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const pagesDir = join(process.cwd(), 'src', 'pages');
const seoFile = join(process.cwd(), 'src', 'data', 'seo.ts');
const seoSource = readFileSync(seoFile, 'utf8');
const routeMatches = [...seoSource.matchAll(/^\s*'([^']+)':\s*\{/gm)];
const registeredRoutes = new Set(routeMatches.map((match) => match[1]));
const ignoredFiles = new Set(['robots.txt.ts', 'manifest.webmanifest.ts']);

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (entry === 'api') {
        return [];
      }

      return walk(fullPath);
    }

    return fullPath.endsWith('.astro') ? [fullPath] : [];
  });
}

function routeFromPage(file) {
  const relativePath = relative(pagesDir, file).split(sep).join('/');

  if (ignoredFiles.has(relativePath)) {
    return null;
  }

  if (relativePath === 'index.astro') {
    return '/';
  }

  const route = `/${relativePath.replace(/\.astro$/, '')}`;

  return route.endsWith('/index') ? route.slice(0, -'/index'.length) || '/' : route;
}

const sourceRoutes = new Set(walk(pagesDir).map(routeFromPage).filter(Boolean));
const failures = [];

for (const route of sourceRoutes) {
  if (route.includes('[')) {
    continue;
  }

  if (!registeredRoutes.has(route)) {
    failures.push(`${route}: missing routeMeta entry in src/data/seo.ts`);
  }
}

for (const route of registeredRoutes) {
  if (!sourceRoutes.has(route)) {
    failures.push(`${route}: routeMeta entry has no matching Astro page`);
  }
}

if (!seoSource.includes('satisfies Record<string, PageMeta>')) {
  failures.push('src/data/seo.ts: routeMeta must keep its PageMeta type contract');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Source SEO audit passed for ${sourceRoutes.size} Astro routes.`);
