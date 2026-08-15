# Nestlyra

Static Astro site for home decor inspiration and affiliate content. Optimized for Google and Pinterest discovery.

**Site URL:** https://nestlyraliving.com  
**Stack:** Astro (static) · Tailwind CSS v4 · MDX Content Collections · TypeScript

## Requirements

- Node.js 22.12+ (see `.nvmrc`)

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Open the local URL printed by Astro (usually `http://localhost:4321`).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PUBLIC_SITE_URL` | Canonical site origin (`https://nestlyraliving.com`) |
| `PUBLIC_NEWSLETTER_ENDPOINT` | Optional POST endpoint for newsletter signup |
| `PUBLIC_GA_MEASUREMENT_ID` | Optional GA4 ID (`G-XXXXXXXXXX`); empty = analytics off |

Domain verification for Google Search Console and Pinterest is done via DNS TXT records at your domain provider — no HTML meta tags required.

## Content workflow

Articles live in `src/content/articles/` as MDX files.

1. Add a featured image under `src/assets/articles/`.
2. Create `your-article-slug.mdx` with frontmatter (see existing examples).
3. Import and use `<ProductRecommendation />` inside the MDX body when needed.
4. Run `npm run build` to validate the content schema.

### Frontmatter highlights

- `category` — one of: `bedroom`, `living-room`, `kitchen`, `home-office`, `organization`, `small-spaces`, `interior-design-styles`
- `featured` — surfaces on the homepage “Popular ideas” section
- `affiliateProducts` — rendered in a “Shop the look” block
- `relatedSlugs` — optional explicit related articles (falls back to same category)
- `draft: true` — excluded from production builds

### Affiliate products in MDX

```mdx
---
affiliateProducts:
  - name: "Modern bedside lamp"
    description: "Warm ambient light for small bedrooms."
    why: "Soft directional light feels calmer than a bright ceiling fixture."
    image: ../../assets/products/bedside-lamp.jpg
    url: "https://www.amazon.com/dp/REALASIN?tag=YOURTAG"
---
```

Use frontmatter `affiliateProducts` (rendered once under “Shop the look”). Do **not** also embed `<ProductRecommendation>` in the MDX body, or products will duplicate. URLs containing `EXAMPLE` are rejected by the content schema and never rendered.

Product images live in `src/assets/products/` (Astro `Image`-ready). Keep public `/images/products/` only if you need a plain path string.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Static production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Deploy

Output is fully static (`dist/`). Compatible with **Vercel** and **Cloudflare Pages**.

### Shared settings

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `22`
- Set at least `PUBLIC_SITE_URL=https://nestlyraliving.com` in the host environment
- Optionally set `PUBLIC_GA_MEASUREMENT_ID` from `.env.example`

### Vercel

- Repo connected to Vercel, or CLI deploy
- `vercel.json` sets framework, output, and security/cache headers
- Custom domain: nestlyraliving.com in the Vercel project settings

### Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Compatibility: Node 22
- `public/_headers` is copied into `dist/` for security and asset caching
- Custom domain: nestlyraliving.com in Cloudflare Pages settings

### After first deploy

1. Submit `https://nestlyraliving.com/sitemap-index.xml` in Google Search Console
2. Confirm GSC / Pinterest domain verification via your DNS TXT records
3. Add your GA4 Measurement ID and redeploy (if not already set)
4. Add real Amazon product URLs via `affiliateProducts` when ready to monetize
5. Optionally set `PUBLIC_NEWSLETTER_ENDPOINT` to enable the newsletter block

## Project structure

```
src/
  components/   Reusable UI (SEO, cards, products, TOC, …)
  content/articles/   MDX articles
  layouts/      BaseLayout, ArticleLayout
  pages/        Routes (home, categories, articles, search, legal, 404)
  styles/       Global Tailwind + design tokens
  utils/        Categories, articles helpers, SEO helpers, reading time
  assets/       Optimized images referenced by content
```

## SEO features

- Dynamic titles, meta descriptions, canonical URLs
- Open Graph + Twitter cards
- Organization, Article, WebSite, and Breadcrumb JSON-LD
- XML sitemap (`@astrojs/sitemap`)
- `robots.txt` + RSS feed
- Client-side search via build-time `/search-index` JSON
- Optional GA4 (when `PUBLIC_GA_MEASUREMENT_ID` is set)
