import rss from '@astrojs/rss';
import { getImage } from 'astro:assets';
import { getCollection } from 'astro:content';
import { getArticleHref } from '../utils/articles';
import { getRssSiteOrigin } from '../utils/seo';

function escapeXmlAttr(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function toAbsoluteUrl(pathOrUrl: string, origin: string): string {
  return new URL(pathOrUrl, `${origin}/`).href;
}

export async function GET() {
  const site = getRssSiteOrigin();
  const articles = await getCollection('articles', ({ data }) => data.draft !== true);

  articles.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  const items = await Promise.all(
    articles.map(async (article) => {
      const optimized = await getImage({
        src: article.data.featuredImage,
        width: 1200,
        format: 'jpg',
      });
      const imageUrl = toAbsoluteUrl(optimized.src, site);

      return {
        title: article.data.title,
        description: article.data.description,
        link: getArticleHref(article),
        pubDate: article.data.publishDate,
        categories: [...new Set([article.data.category, ...article.data.tags])],
        enclosure: {
          url: imageUrl,
          type: 'image/jpeg' as const,
          length: 0,
        },
        customData: `<media:content url="${escapeXmlAttr(imageUrl)}" medium="image" type="image/jpeg" />`,
      };
    }),
  );

  return rss({
    title: 'Nestlyra Living',
    description:
      'Home decor inspiration for calm, elevated living — curated rooms, styling ideas, and thoughtfully chosen finds.',
    site,
    trailingSlash: true,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      media: 'http://search.yahoo.com/mrss/',
    },
    customData: [
      '<language>en-us</language>',
      `<atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items,
  });
}
