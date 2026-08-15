import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categoryEnum = z.enum([
  'bedroom',
  'living-room',
  'kitchen',
  'home-office',
  'organization',
  'small-spaces',
  'interior-design-styles',
]);

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => {
    const affiliateProductSchema = z.object({
      name: z.string(),
      description: z.string(),
      why: z.string(),
      /** Prefer `image()` imports from `src/assets/products`; public paths still allowed. */
      image: z.union([image(), z.string()]),
      url: z
        .string()
        .url()
        .refine((value) => !/EXAMPLE/i.test(value), {
          message:
            'Replace placeholder Amazon ASINs (EXAMPLE*) with real product URLs before publish.',
        }),
    });

    return z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default('Nestlyra Editorial'),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: categoryEnum,
      tags: z.array(z.string()).default([]),
      featuredImage: image(),
      featuredImageAlt: z
        .string()
        .refine((value) => !/placeholder/i.test(value), {
          message: 'featuredImageAlt must not contain placeholder language.',
        }),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      seo: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          ogImage: z.string().optional(),
          noindex: z.boolean().optional(),
        })
        .optional(),
      affiliateProducts: z.array(affiliateProductSchema).optional(),
      relatedSlugs: z.array(z.string()).optional(),
    });
  },
});

export const collections = { articles };
