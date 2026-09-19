import { readFileSync, writeFileSync } from 'node:fs';
import { transform } from 'esbuild';
const result = await transform(readFileSync('public/assets/js/main.js','utf8'), { minify:true, target:'es2020' });
writeFileSync('public/assets/js/main.min.js',result.code);
