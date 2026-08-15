export const SITE_NAME = 'Nestlyra';
export const SITE_TAGLINE = 'Home inspiration worth living in';

export type CategorySlug =
  | 'bedroom'
  | 'living-room'
  | 'kitchen'
  | 'home-office'
  | 'organization'
  | 'small-spaces'
  | 'interior-design-styles';

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  pinDescription: string;
}

export const categories: Category[] = [
  {
    slug: 'bedroom',
    name: 'Bedroom',
    description:
      'Calm bedroom decor ideas for layered textiles, soft lighting, and sleep spaces that feel restorative.',
    pinDescription: 'Bedroom decor ideas for a calm, elevated sleep space.',
  },
  {
    slug: 'living-room',
    name: 'Living Room',
    description:
      'Living room inspiration with warm seating plans, textured layers, and gathering spaces that still feel edited.',
    pinDescription: 'Living room inspiration with cozy, magazine-worthy style.',
  },
  {
    slug: 'kitchen',
    name: 'Kitchen',
    description:
      'Kitchen design ideas that blend beauty and function — quiet hardware, open shelves, and everyday ritual zones.',
    pinDescription: 'Kitchen design ideas that blend beauty and function.',
  },
  {
    slug: 'home-office',
    name: 'Home Office',
    description:
      'Home office setup ideas for focused workspaces that still feel residential — light, storage, and soft acoustics.',
    pinDescription: 'Home office setups that look as good as they work.',
  },
  {
    slug: 'organization',
    name: 'Organization',
    description:
      'Home organization ideas that reduce visual noise with baskets, zones, and storage systems that still look beautiful.',
    pinDescription: 'Home organization ideas for serene, clutter-free rooms.',
  },
  {
    slug: 'small-spaces',
    name: 'Small Spaces',
    description:
      'Small space decor tips that maximize style and square footage with smarter layouts and multipurpose furniture.',
    pinDescription: 'Small space decor tips that maximize style and square footage.',
  },
  {
    slug: 'interior-design-styles',
    name: 'Interior Design Styles',
    description:
      'Interior design styles explained — from quiet luxury to lived-in modern — with room-by-room inspiration to try at home.',
    pinDescription: 'Interior design styles explained with room-by-room inspiration.',
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((category) => category.slug === slug);
}
