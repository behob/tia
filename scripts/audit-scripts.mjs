import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const distDir = join(process.cwd(), 'dist', 'client');
const expectedScriptRoutes = {
  '/assets/js/slider.js': ['/', '/index-2', '/index-3', '/index-9'],
  '/assets/js/banner-process.js': ['/index-2', '/index-3'],
  '/assets/js/contact.js': ['/contact'],
  '/assets/js/vendor/countdown.js': ['/coming-soon'],
};

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

  for (const [script, allowedRoutes] of Object.entries(expectedScriptRoutes)) {
    const shouldLoad = allowedRoutes.includes(route);
    const doesLoad = html.includes(script);

    if (shouldLoad !== doesLoad) {
      failures.push(`${route}: ${script} expected ${shouldLoad ? 'present' : 'absent'}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Script route audit passed.');
