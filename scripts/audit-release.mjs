import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

// This check validates the public build configuration, not live Worker secrets.
export function auditRelease({ environment, root = process.cwd(), built = false }) {
  const failures = [];
  const siteKey = environment.PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '';
  if (!siteKey || /your[-_]|replace|placeholder|example/i.test(siteKey)) {
    failures.push('Set a production PUBLIC_TURNSTILE_SITE_KEY in the build environment.');
  } else if (/^[123]x0{8,}/.test(siteKey)) {
    failures.push('Cloudflare Turnstile test keys must not be used for a production release.');
  }
  if (!built) return failures;

  const client = join(root, 'dist/client');
  if (!existsSync(client)) return [...failures, 'Missing dist/client; build the website first.'];
  const walk = (directory) =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    });
  let forms = 0;
  for (const path of walk(client)) {
    if (!/\.(?:html|js|json|map|txt|xml|css)$/i.test(path)) continue;
    const text = readFileSync(path, 'utf8');
    const name = relative(root, path);
    // Never include secret values or matching source text in diagnostics.
    for (const key of ['RESEND_API_KEY', 'TURNSTILE_SECRET_KEY']) {
      const value = environment[key];
      if (value && value.length >= 8 && text.includes(value)) {
        failures.push(`${name}: ${key} was included in public output.`);
      }
    }
    if (!path.endsWith('.html')) continue;
    for (const match of text.matchAll(/<form\b[^>]*data-enhanced-form[^>]*>[\s\S]*?<\/form>/g)) {
      forms++;
      const key = match[0].match(/data-turnstile-key="([^"]*)"/)?.[1];
      if (!siteKey || key !== siteKey) {
        failures.push(`${name}: a form is missing the current production Turnstile key. Rebuild with the correct key.`);
      }
    }
  }
  if (!forms) failures.push('No enhanced forms found in the build; check the build output.');
  return failures;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const environment = loadEnv('production', process.cwd(), '');
  const failures = auditRelease({ environment, built: process.argv.includes('--built') });
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(
      'Release configuration passed. Production Worker secrets and email delivery still require a live check.',
    );
  }
}
