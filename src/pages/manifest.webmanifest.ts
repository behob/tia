import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: 'TIA Interior',
      short_name: 'TIA Interior',
      description: 'Architecture and luxury interior design studio in Dubai, UAE.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#101010',
      theme_color: '#101010',
      icons: [
        {
          src: '/favicon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
        },
        {
          src: '/assets/img/favicon.webp',
          sizes: '512x512',
          type: 'image/webp',
        },
      ],
    }),
    {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
      },
    },
  );
