import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const distDir = join(process.cwd(), 'dist', 'client');
const failures = [];

function walkHtml(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return walkHtml(fullPath);
    }

    return entry === 'index.html' ? [fullPath] : [];
  });
}

function routeFromHtml(file) {
  const relativePath = relative(distDir, file).split(sep).join('/');
  return relativePath === 'index.html' ? '/' : `/${relativePath.replace(/\/index\.html$/, '')}`;
}

function normalizeInternalPath(href) {
  const clean = href.split('#')[0].split('?')[0].replace(/\/$/, '');
  return clean || '/';
}

const htmlFiles = existsSync(distDir) ? walkHtml(distDir).filter((file) => !routeFromHtml(file).startsWith('/gallary-')) : [];
const routes = new Set(htmlFiles.map(routeFromHtml));
const publicFiles = new Set();

function walkPublic(dir, base = dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walkPublic(fullPath, base);
    } else {
      publicFiles.add(`/${relative(base, fullPath).split(sep).join('/')}`);
    }
  }
}

walkPublic(join(process.cwd(), 'public'));

for (const file of htmlFiles) {
  const route = routeFromHtml(file);
  const html = readFileSync(file, 'utf8');
  const matches = [
    ...html.matchAll(/\s(?:href|src|action)=(["'])(.*?)\1/g),
    ...html.matchAll(/\sdata-background(?:-mobile)?=(["'])(.*?)\1/g),
  ];

  for (const [, , rawValue] of matches) {
    if (!rawValue || rawValue.startsWith('#') || rawValue.startsWith('mailto:') || rawValue.startsWith('tel:')) {
      continue;
    }

    if (/^(https?:)?\/\//.test(rawValue)) {
      try {
        new URL(rawValue.startsWith('//') ? `https:${rawValue}` : rawValue);
      } catch {
        failures.push(`${route}: malformed external URL ${rawValue}`);
      }
      continue;
    }

    if (!rawValue.startsWith('/')) {
      continue;
    }

    if (rawValue.startsWith('/assets/') || rawValue.startsWith('/_astro/') || rawValue === '/favicon.svg' || rawValue === '/favicon.ico') {
      const assetPath = rawValue.split('#')[0].split('?')[0];
      if (assetPath.startsWith('/assets/') && !publicFiles.has(assetPath)) {
        failures.push(`${route}: missing asset link ${rawValue}`);
      }
      continue;
    }

    if (rawValue === '/api/mail' || rawValue === '/manifest.webmanifest') {
      continue;
    }

    const targetRoute = normalizeInternalPath(rawValue);

    if (!routes.has(targetRoute)) {
      failures.push(`${route}: internal link points to missing route ${rawValue}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Link audit passed for ${routes.size} generated routes.`);
