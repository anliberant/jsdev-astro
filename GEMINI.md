# Project Overview: JSDev.Space

This file contains key information about the project, its structure, and technologies to speed up analysis in the future.

## 1. General Information

- **Name:** JSDev.Space (`jsdev` in `package.json`)
- **Type:** A modern blog and developer tools platform.
- **URL:** [https://jsdev.space](https://jsdev.space)
- **Architecture:** The project is structured according to the **Feature-Sliced Design (FSD)** methodology.
- **Deployment:** Configured for deployment on **Netlify**.

## 2. Tech Stack

- **Framework:** [Astro](https://astro.build/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Content:** `md` and `mdx` files in `src/content/`. Uses **Astro Content Collections**.
- **Package Manager:** `pnpm` (recommended in `README.md`)
- **Styling:** Uses CSS variables and scoped styles within Astro components.
- **Code Quality:** ESLint and Prettier.

## 3. Project Structure

- **`astro.config.mjs`**: Main Astro configuration file. Includes integrations for MDX, Sitemap, and Netlify.
- **`tsconfig.json`**: Configured with a path alias `@/*` for `src/*`.
- **`src/`**: Source code, organized by FSD:
  - `app/`: App configuration, global styles, and layouts.
  - `pages/`: File-based routing for Astro.
  - `content/`: Content Collections:
    - `posts`: Blog posts.
    - `howtos`: How-to guides.
    - `fridays`: Friday link roundups.
    - `snippets`: Code snippets.
  - `entities/`: Business entities (e.g., `post`, `category`).
  - `features/`: Feature-level logic (e.g., `search`, `tools`).
  - `widgets/`: Composite UI components (e.g., `Header`, `Footer`).
  - `shared/`: Reusable code (UI components, utils, hooks).
- **`generate-og-images.ts`**: A custom script using `tsx` to generate Open Graph images for pages.

## 4. Key Commands (using `pnpm`)

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the project for production (includes OG image generation).
- `pnpm preview`: Previews the production build locally.
- `pnpm lint`: Lints the code with ESLint.
- `pnpm prettier`: Formats the code with Prettier.
- `pnpm type-check`: Runs TypeScript type checking.
- `pnpm generate:og`: Explicitly runs the OG image generation script.
