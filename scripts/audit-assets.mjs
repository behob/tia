import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';

const projectRoot = process.cwd();
const sourceDirs = ['src', 'dist/client'];
const checkedExtensions = new Set(['.astro', '.css', '.html', '.js', '.json', '.mjs', '.scss', '.ts']);
const assetPattern = /(["'(`=])(?<asset>\/assets\/[^"'`)\s?#]+)(?:[?#][^"'`)\s]*)?/g;
const ignoredDynamicMarkers = ['${'];
const failures = [];
const checkedAssets = new Set();
const usedIcons = new Set();
const iconStylesheet = readFileSync(join(projectRoot, 'public/assets/css/fontawesome-subset.css'), 'utf8');
const availableIcons = new Set(
  [...iconStylesheet.matchAll(/\.fa-(?<icon>[a-z0-9-]+)::before/g)].map((match) => match.groups.icon),
);

function walk(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return walk(fullPath);
    }

    return checkedExtensions.has(extname(fullPath)) ? [fullPath] : [];
  });
}

function toDisplayPath(file) {
  return relative(projectRoot, file).split(sep).join('/');
}

for (const dir of sourceDirs.map((sourceDir) => join(projectRoot, sourceDir))) {
  for (const file of walk(dir)) {
    const source = readFileSync(file, 'utf8');

    if (extname(file) === '.astro' || extname(file) === '.ts') {
      for (const match of source.matchAll(
        /\bfa-(?!brands\b|light\b|regular\b|sharp\b|solid\b|thin\b)(?<icon>[a-z0-9-]+)/g,
      )) {
        usedIcons.add(match.groups.icon);
      }
    }

    for (const match of source.matchAll(assetPattern)) {
      const asset = match.groups.asset;

      if (ignoredDynamicMarkers.some((marker) => asset.includes(marker))) {
        continue;
      }

      const assetPath = join(projectRoot, 'public', asset);
      checkedAssets.add(asset);

      if (!existsSync(assetPath)) {
        failures.push(`${toDisplayPath(file)}: missing public asset ${asset}`);
      }
    }
  }
}

for (const icon of usedIcons) {
  if (!availableIcons.has(icon)) {
    failures.push(`Font Awesome subset is missing the fa-${icon} glyph used by source.`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Asset audit passed for ${checkedAssets.size} unique public assets and ${usedIcons.size} icon glyphs.`);
