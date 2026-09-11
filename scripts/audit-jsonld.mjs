import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const distDir = join(process.cwd(), 'dist', 'client');

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

function flattenJsonLd(value) {
  return Array.isArray(value) ? value.flatMap(flattenJsonLd) : [value];
}

const requiredByType = {
  Article: ['headline', 'image', 'publisher', 'mainEntityOfPage'],
  BreadcrumbList: ['itemListElement'],
  CreativeWork: ['name', 'description', 'image', 'creator'],
  FAQPage: ['mainEntity'],
  LocalBusiness: ['name', 'url', 'telephone', 'email', 'address'],
  Organization: ['name', 'url', 'logo'],
  Service: ['name', 'description', 'provider', 'areaServed'],
  WebPage: ['url', 'name', 'description', 'isPartOf'],
  WebSite: ['url', 'name', 'publisher'],
};

const failures = [];
let objectCount = 0;
const routes = existsSync(distDir)
  ? walkHtml(distDir)
      .map((file) => ({ file, route: routeFromHtml(file) }))
      .filter(({ route }) => !route.startsWith('/gallary-'))
  : [];

for (const { route, file } of routes) {
  if (!existsSync(file)) {
    failures.push(`${route}: missing built HTML`);
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  if (scripts.length === 0) {
    failures.push(`${route}: missing JSON-LD script`);
    continue;
  }

  for (const [, rawJson] of scripts) {
    let parsed;

    try {
      parsed = JSON.parse(rawJson);
    } catch (error) {
      failures.push(`${route}: invalid JSON-LD (${error.message})`);
      continue;
    }

    for (const item of flattenJsonLd(parsed)) {
      objectCount += 1;
      const type = item?.['@type'];

      if (!item?.['@context']) {
        failures.push(`${route}: JSON-LD ${type ?? 'object'} missing @context`);
      }

      if (!type) {
        failures.push(`${route}: JSON-LD object missing @type`);
        continue;
      }

      for (const field of requiredByType[type] ?? []) {
        if (item[field] === undefined || item[field] === null || item[field] === '') {
          failures.push(`${route}: JSON-LD ${type} missing ${field}`);
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`JSON-LD audit passed for ${objectCount} structured data objects.`);
