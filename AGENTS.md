# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

JSDev.Space (https://jsdev.space) — a blog and developer tools platform built with Astro 5, TypeScript (strict mode), and deployed on Netlify. Uses Feature-Sliced Design (FSD) architecture.

## Commands

- `npm run dev` — start dev server (localhost:4321)
- `npm run build` — generate OG images then build for production (runs `generate:og` first)
- `npm run preview` — preview production build
- `npm run lint` — ESLint (`eslint . --ext .js,.ts,.astro`)
- `npm run lint:fix` — auto-fix lint issues
- `npm run prettier` — format code with Prettier
- `npm run prettier:check` — check formatting
- `npm run type-check` — TypeScript check (`tsc --noEmit`)
- `npm run clean` — wipe `node_modules/.vite`, `dist`, `.astro`
- `npm run generate:og` — generate Open Graph images for howtos and snippets (uses satori + resvg-js)

Note: `package-lock.json` is present (npm), though README mentions pnpm. Use `npm` for consistency with `netlify.toml`.

## Architecture (Feature-Sliced Design)

The `src/` directory follows FSD layers with strict import rules — upper layers may import from lower layers but not vice versa:

- **`app/`** — Global config (`config/site.ts` has all site metadata, nav, SEO strings), base layout (`layouts/base-layout.astro`), and global styles.
- **`pages/`** — Astro file-based routing. Uses `getStaticPaths` + `getCollection` for dynamic routes. Key patterns:
  - `[slug].astro` — blog posts (from `posts` collection)
  - `howto/[slug].astro` — howto articles
  - `snippets/[slug].astro` — code snippets
  - `friday/[slug].astro` — friday link roundups
  - `[category]/[...page].astro` and `howto/[category]/[...page].astro` — paginated category listings
  - `tag/[tag]/[...page].astro` — paginated tag listings
- **`features/`** — Self-contained feature modules. The search feature (`features/search/`) has its own model/store, types, lib, and UI.
- **`entities/`** — Business entities (post, howto, categories) with their UI cards and list components.
- **`widgets/`** — Composite layout blocks: header (with nav, search, theme switcher) and footer.
- **`shared/`** — Reusable code shared across all layers:
  - `helpers/` — domain logic (category info/colors, breadcrumbs, pagination, search)
  - `hooks/` — data hooks (unique categories, unique tags)
  - `lib/` — utilities (TTL cache, DOM utils, error handler)
  - `types/index.ts` — all shared TypeScript interfaces (PostData, HowtoData, SnippetData, FridayData, tool types, converter types)
  - `ui/` — reusable Astro components (base: card, badge, button; layout: pagination, TOC, tags; mdx: custom MDX component overrides)
  - `utils/` — general utilities (clipboard, stats, format URL, time formatting)

## Content Collections

Defined in `src/content.config.ts` using Astro's `defineCollection` with Zod schemas and glob loaders. Four collections:

**posts** (`src/content/posts/{slug}/post.mdx`):
- Frontmatter: title (max 65), desc (max 165), heading (max 115), author, date, category, tags[], image (Astro image()), permalink, slug, isDraft?

**howtos** (`src/content/howtos/{slug}/howto.mdx`):
- Same as posts plus: icon (string), type: "howto". Image is a string (not Astro image).

**snippets** (`src/content/snippets/{category}/{slug}/snippet.mdx`):
- Frontmatter: title, desc, heading, slug, author, date, category, tags[], image?, icon?, permalink, type: "snippets", isDraft?

**fridays** (`src/content/friday/{number}/friday.mdx`):
- Frontmatter: title, desc, heading, slug, author, date, image (Astro image()), permalink, type: "friday", isDraft?

Each content item lives in its own directory. Posts and fridays co-locate images in an `images/` subdirectory. Permalinks follow the pattern: `{slug}` for posts, `howto/{slug}` for howtos, `snippets/{slug}` for snippets, `friday/{slug}` for fridays.

Draft filtering: pages use `getCollection('posts', ({ data }) => !data.isDraft)`.

## Key Conventions

- **Path alias**: `@/` maps to `src/` (configured in both `tsconfig.json` and `astro.config.mjs`).
- **Import order** (enforced by Prettier plugin): astro → third-party → `@/app` → `@/widgets` → `@/features` → `@/entities` → `@/shared` → relative paths. This mirrors the FSD layer hierarchy.
- **MDX components**: Custom component overrides are in `shared/ui/mdx/index.ts` (exported as `mdxComponents`). Pages pass them via `<Content components={mdxComponents} />`.
- **Reading time**: A custom remark plugin (`shared/utils/remark-reading-time.mjs`) injects `minutesRead` into frontmatter at build time.
- **OG images**: Auto-generated at build time for howtos and snippets only, using satori → resvg-js. Output to `public/og/{slug}.png`. Requires `public/fonts/Inter-Regular.ttf`.
- **Category system**: `shared/helpers/category.helpers.ts` contains a hardcoded list of valid categories with SEO descriptions for both "post" and "howto" types. New categories must be added here.
- **Styling**: CSS variables for theming (dark/light), scoped styles in `.astro` files, global styles in `shared/styles/`. Fonts: PT Serif, Roboto, Fira Code (loaded from Google Fonts).
- **Pagination**: `siteConfig.postsPerPage = 15`. Pagination logic is in `shared/helpers/pagination.helpers.ts` and `shared/utils/format-url.ts`.
- **Netlify build**: Uses `NODE_OPTIONS="--max_old_space_size=4096"` for the build. Adapter: `@astrojs/netlify`.

## ESLint Rules

- `no-unused-vars`: error (prefix unused args with `_`)
- `no-console`: warn (allow `console.warn` and `console.error`)
- `prefer-const`, `no-var`, `object-shorthand`, `prefer-template`: enforced
- TypeScript: `@typescript-eslint/no-explicit-any` is warn (not error)

## Prettier Config

- Single quotes, trailing commas (es5), no semicolons omission, 2-space indent, arrow parens "avoid"
- Plugins: `prettier-plugin-astro`, `@ianvs/prettier-plugin-sort-imports`
