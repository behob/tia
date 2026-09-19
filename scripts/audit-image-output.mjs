import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
const root = 'dist/client';
const variants = new Map();
for (const file of readdirSync(root, { recursive: true }).filter((file) => file.endsWith('.html'))) {
  const html = readFileSync(join(root, file), 'utf8');
  for (const [, set] of html.matchAll(/srcset="([^"]+)"/g))
    for (const variant of set.split(',')) {
      const match = variant.trim().match(/^(\/_astro\/\S+) (\d+)w$/);
      if (match) variants.set(match[1], Number(match[2]));
    }
}
assert(variants.size > 100, 'Expected generated responsive image variants');
for (const [src, width] of variants) {
  const path = join(root, decodeURIComponent(src));
  assert(statSync(path).size > 0);
  const actual = await sharp(path).metadata();
  assert.equal(actual.width, width, `Responsive image is not resized: ${src}`);
}
console.log(`Image output audit passed for ${variants.size} actual resized variants.`);
