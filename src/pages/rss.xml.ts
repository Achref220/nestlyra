import type { APIRoute } from 'astro';
import { getPublishedArticles } from '../utils/articles';
import { getSiteUrl } from '../utils/seo';
import { SITE_NAME } from '../utils/categories';

export const GET: APIRoute = async () => {
  const site = getSiteUrl();
  const articles = await getPublishedArticles();

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.data.title}]]></title>
      <link>${site}/articles/${article.id}/</link>
      <guid>${site}/articles/${article.id}/</guid>
      <description><![CDATA[${article.data.description}]]></description>
      <pubDate>${article.data.publishDate.toUTCString()}</pubDate>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${site}/</link>
    <description>Home decor inspiration and styling ideas from ${SITE_NAME}.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
