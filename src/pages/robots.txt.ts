import type { APIRoute } from 'astro';

const siteUrl = 'https://tiadecors.com';

export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /coming-soon',
      'Disallow: /error-page',
      '',
      `Sitemap: ${siteUrl}/sitemap-index.xml`,
      '',
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
