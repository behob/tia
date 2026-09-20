import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { auditRelease } from './audit-release.mjs';

const environment = {
  PUBLIC_TURNSTILE_SITE_KEY: '0x4AAAA-valid-public-fixture',
  RESEND_API_KEY: 're_private-fixture-never-publish',
  TURNSTILE_SECRET_KEY: 'private-turnstile-fixture-never-publish',
};
assert.equal(auditRelease({ environment }).length, 0);
for (const key of [
  '',
  'your-cloudflare-turnstile-site-key',
  '1x00000000000000000000AA',
  '2x00000000000000000000AB',
  '3x00000000000000000000FF',
]) {
  assert(auditRelease({ environment: { PUBLIC_TURNSTILE_SITE_KEY: key } }).length > 0);
}
const root = mkdtempSync(join(tmpdir(), 'tia-release-check-'));
try {
  assert(auditRelease({ environment, root, built: true }).some((error) => error.includes('Missing dist/client')));
  const client = join(root, 'dist/client');
  mkdirSync(client, { recursive: true });
  const page = join(client, 'index.html');
  const form = (key) => `<form action="/api/mail" data-enhanced-form><div data-turnstile-key="${key}"></div></form>`;
  writeFileSync(page, form(environment.PUBLIC_TURNSTILE_SITE_KEY));
  assert.deepEqual(auditRelease({ environment, root, built: true }), []);
  writeFileSync(page, form('previous-build-site-key'));
  assert(auditRelease({ environment, root, built: true }).some((error) => error.includes('Rebuild')));
  writeFileSync(page, '<form action="/api/mail" data-enhanced-form></form>');
  assert(auditRelease({ environment, root, built: true }).some((error) => error.includes('missing')));
  writeFileSync(page, '<main>No form</main>');
  assert(auditRelease({ environment, root, built: true }).some((error) => error.includes('No enhanced forms')));
  writeFileSync(page, form(environment.PUBLIC_TURNSTILE_SITE_KEY));
  for (const key of ['RESEND_API_KEY', 'TURNSTILE_SECRET_KEY']) {
    writeFileSync(join(client, 'app.js'), `const accidentallyPublished = '${environment[key]}'`);
    const failures = auditRelease({ environment, root, built: true });
    assert(failures.some((error) => error.includes(key)));
    assert(!failures.join('\n').includes(environment[key]), 'diagnostics must not expose the leaked value');
  }
} finally {
  // Verify the exact generated target before recursively removing the fixture.
  assert(
    isAbsolute(root) && dirname(resolve(root)) === resolve(tmpdir()) && basename(root).startsWith('tia-release-check-'),
  );
  rmSync(root, { recursive: true, force: true });
}
console.log('Release checks passed: missing/test keys, stale builds, missing widgets and public secret leakage.');
