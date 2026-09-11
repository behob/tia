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

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? '';
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

const failures = [];
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
  const ids = new Map();

  for (const match of html.matchAll(/\sid=(["'])(.*?)\1/g)) {
    const id = match[2];
    ids.set(id, (ids.get(id) ?? 0) + 1);
  }

  for (const [id, count] of ids.entries()) {
    if (count > 1) {
      failures.push(`${route}: duplicate id "${id}"`);
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const alt = attr(tag, 'alt');

    if (!/\salt=(["']).*?\1/i.test(tag)) {
      failures.push(`${route}: image missing alt attribute`);
    } else if (alt.trim().length === 0) {
      failures.push(`${route}: image has empty alt text`);
    }
  }

  for (const match of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const tag = match[0];
    const label = attr(tag, 'aria-label') || attr(tag, 'title') || stripTags(match[1]);

    if (!label) {
      failures.push(`${route}: button missing accessible name`);
    }
  }

  for (const match of html.matchAll(/<(input|textarea|select)\b[^>]*>/gi)) {
    const tag = match[0];
    const type = attr(tag, 'type').toLowerCase();

    if (type === 'hidden' || attr(tag, 'aria-hidden') === 'true') {
      continue;
    }

    const id = attr(tag, 'id');
    const hasLabel = id ? new RegExp(`<label\\b[^>]*\\sfor=(["'])${id}\\1`, 'i').test(html) : false;
    const hasAccessibleName = hasLabel || attr(tag, 'aria-label') || attr(tag, 'aria-labelledby') || attr(tag, 'placeholder');

    if (!hasAccessibleName) {
      failures.push(`${route}: form control missing accessible name`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Accessibility audit passed for ${routes.length} routes.`);
