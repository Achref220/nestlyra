import { getCollection, type CollectionEntry } from 'astro:content';
import { getCategory, type CategorySlug } from './categories';

export type ArticleEntry = CollectionEntry<'articles'>;

export async function getPublishedArticles(): Promise<ArticleEntry[]> {
  const articles = await getCollection('articles', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  return articles.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

export async function getArticlesByCategory(category: CategorySlug): Promise<ArticleEntry[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.data.category === category);
}

export async function getFeaturedArticles(limit = 4): Promise<ArticleEntry[]> {
  const articles = await getPublishedArticles();
  const featured = articles.filter((article) => article.data.featured);
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }
  return articles.slice(0, limit);
}

export async function getLatestArticles(limit = 6): Promise<ArticleEntry[]> {
  const articles = await getPublishedArticles();
  return articles.slice(0, limit);
}

export function getArticleHref(article: ArticleEntry): string {
  return `/articles/${article.id}/`;
}

export async function getRelatedArticles(
  article: ArticleEntry,
  limit = 3,
): Promise<ArticleEntry[]> {
  const all = await getPublishedArticles();
  const selected: ArticleEntry[] = [];
  const seen = new Set<string>([article.id]);

  const pushUnique = (entries: ArticleEntry[]) => {
    for (const entry of entries) {
      if (seen.has(entry.id) || selected.length >= limit) continue;
      seen.add(entry.id);
      selected.push(entry);
    }
  };

  if (article.data.relatedSlugs?.length) {
    pushUnique(
      article.data.relatedSlugs
        .map((slug) => all.find((entry) => entry.id === slug))
        .filter((entry): entry is ArticleEntry => Boolean(entry)),
    );
  }

  if (selected.length < limit) {
    pushUnique(
      all.filter(
        (entry) =>
          entry.id !== article.id && entry.data.category === article.data.category,
      ),
    );
  }

  if (selected.length < limit) {
    const articleTags = new Set(article.data.tags.map((tag) => tag.toLowerCase()));
    pushUnique(
      all
        .filter((entry) => entry.id !== article.id)
        .map((entry) => ({
          entry,
          score: entry.data.tags.reduce(
            (sum, tag) => sum + (articleTags.has(tag.toLowerCase()) ? 1 : 0),
            0,
          ),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ entry }) => entry),
    );
  }

  if (selected.length < limit) {
    pushUnique(all.filter((entry) => entry.id !== article.id));
  }

  return selected.slice(0, limit);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getCategoryLabel(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}
