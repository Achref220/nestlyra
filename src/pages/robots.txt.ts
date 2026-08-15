import type { APIRoute } from 'astro';
import { getSiteUrl } from '../utils/seo';

export const GET: APIRoute = () => {
  const site = getSiteUrl();
  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap-index.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
