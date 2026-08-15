import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { getPublishedArticles, getCategoryLabel } from '../utils/articles';

export const GET: APIRoute = async () => {
  const articles = await getPublishedArticles();

  const index = await Promise.all(
    articles.map(async (article) => {
      const image = await getImage({
        src: article.data.featuredImage,
        width: 480,
        format: 'webp',
      });

      return {
        id: article.id,
        title: article.data.title,
        description: article.data.description,
        category: article.data.category,
        categoryLabel: getCategoryLabel(article.data.category),
        tags: article.data.tags,
        href: `/articles/${article.id}/`,
        image: image.src,
        imageAlt: article.data.featuredImageAlt,
        publishDate: article.data.publishDate.toISOString(),
      };
    }),
  );

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
