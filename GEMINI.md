# Project: JSDev.Space

## Overview
- **Type:** Blog and developer tools platform.
- **URL:** https://jsdev.space
- **Architecture:** Feature-Sliced Design (FSD).
- **Deployment:** Netlify.

## Tech Stack
- **Framework:** Astro
- **Language:** TypeScript (strict mode)
- **Content:** `md` and `mdx` in `src/content/` (Astro Content Collections).
- **Package Manager:** pnpm
- **Styling:** CSS variables, scoped styles.
- **Code Quality:** ESLint, Prettier.

## Structure
- **`astro.config.mjs`**: Astro configuration (MDX, Sitemap, Netlify integrations).
- **`tsconfig.json`**: TypeScript configuration (`@/*` alias for `src/*`).
- **`src/`**: Source code (FSD organization):
  - `app/`: Config, global styles, layouts.
  - `pages/`: Astro file-based routing.
  - `content/`: Content Collections (`posts`, `howtos`, `fridays`, `snippets`).
  - `entities/`: Business entities.
  - `features/`: Feature logic.
  - `widgets/`: Composite UI components.
  - `shared/`: Reusable code.
- **`generate-og-images.ts`**: Custom script for Open Graph image generation.

## Key pnpm Commands
- `pnpm dev`: Start dev server.
- `pnpm build`: Build for production.
- `pnpm preview`: Preview production build.
- `pnpm lint`: Lint code.
- `pnpm prettier`: Format code.
- `pnpm type-check`: Run TypeScript check.
- `pnpm generate:og`: Generate OG images.