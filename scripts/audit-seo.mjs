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

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const failures = [];
const pages = existsSync(distDir)
  ? walkHtml(distDir)
      .map((file) => ({ file, route: routeFromHtml(file) }))
      .filter(({ route }) => !route.startsWith('/gallary-'))
  : [];

for (const { route, file } of pages) {
  try {
    assert(existsSync(file), `${route}: missing built HTML`);
    const html = readFileSync(file, 'utf8');
    assert(/<title>[^<]+<\/title>/.test(html), `${route}: missing title`);
    assert(/<meta name="description" content="[^"]+">/.test(html), `${route}: missing meta description`);
    assert(/<meta name="robots" content="[^"]+">/.test(html), `${route}: missing robots meta`);
    assert(/<link rel="canonical" href="https:\/\/tiadecors\.com\/[^"]*">/.test(html), `${route}: missing canonical`);
    assert(/<meta property="og:type" content="[^"]+">/.test(html), `${route}: missing og:type`);
    assert(/<meta property="og:image" content="https:\/\/tiadecors\.com\/assets\/img\/[^"]+\.webp">/.test(html), `${route}: missing og:image`);
    assert(!html.includes('undefined'), `${route}: contains undefined`);
    assert(!html.includes('content=""'), `${route}: contains empty meta content`);
    assert(!/\/assets\/img\/[^"')]+\.png/.test(html), `${route}: references legacy PNG image`);
    assert(/application\/ld\+json/.test(html), `${route}: missing JSON-LD`);
  } catch (error) {
    failures.push(error.message);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`SEO audit passed for ${pages.length} routes.`);
