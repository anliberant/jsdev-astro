

# 🚀 JSDev.Space - Modern JavaScript Development Hub

> **Built with passion for [JSDev.Space](https://jsdev.space), shared with love for the community** ❤️

A modern, lightning-fast blog and developer tools platform built with Astro, TypeScript, and Feature-Sliced Design architecture. This project powers [jsdev.space](https://jsdev.space) - your ultimate resource for JavaScript tutorials, guides, and development tools.

## ✨ Features

- 🔥 **Blazing Fast**: Built with Astro for optimal performance
- 🎨 **Modern Design**: Clean, responsive UI with dark/light theme support
- 🔍 **Smart Search**: Real-time search across all content with keyboard shortcuts
- 🛠️ **Developer Tools**: Collection of useful converters and generators
- 📱 **Mobile First**: Fully responsive design for all devices
- ♿ **Accessible**: Built with accessibility in mind
- 🏗️ **FSD Architecture**: Well-organized codebase using Feature-Sliced Design
- 📝 **MDX Support**: Rich content with custom components
- 🎯 **SEO Optimized**: Perfect Lighthouse scores

## 🚀 Quick Start

### Prerequisites

- Node.js 22.12.0+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/anliberant/jsdev-astro.git

# Navigate to project directory
cd jsdev-space

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:4321` to see your site running!

### Build for Production

```bash
# Build the site
pnpm build

# Preview the build
pnpm preview
```

## 🏗️ Architecture: Feature-Sliced Design (FSD)

This project follows the [Feature-Sliced Design](https://feature-sliced.design/) methodology for better code organization and maintainability.

```
src/
├── app/                    # App-level configuration
│   ├── config/            # Site configuration
│   └── layouts/           # Global layouts
├── entities/              # Business entities
│   ├── categories/        # Category management
│   ├── post/             # Blog posts
│   ├── howto/            # How-to tutorials
│   └── tools/            # Tool entities
├── features/              # Feature implementations
│   ├── search/           # Search functionality
│   └── tools/            # Developer tools
│       ├── html/         # HTML converters
│       └── mdx/          # MDX editor
├── shared/                # Shared utilities
│   ├── ui/               # Reusable UI components
│   ├── helpers/          # Helper functions
│   ├── hooks/            # Custom hooks
│   └── utils/            # Utility functions
├── widgets/               # Complex UI blocks
│   ├── header/           # Site header
│   └── footer/           # Site footer
└── pages/                 # Astro pages (routes)
```

## 🔍 Search System

The project features a powerful search system with the following components:

- **Location**: `src/features/search/`
- **Real-time search** across posts, tutorials, snippets, and Friday links
- **Keyboard shortcuts**: `⌘K` or `/` to open search
- **Smart filtering** by content type
- **Fuzzy search** capabilities

### Key Search Files:

- `src/features/search/ui/search.astro` - Main search component
- `src/features/search/model/store.ts` - Search logic and state management
- `src/features/search/lib/utils.ts` - Search utilities

## 🛠️ Developer Tools

Find all developer tools in the `src/features/tools/` directory:

### HTML Tools (`src/features/tools/html/`)

- **HTML to JSX Converter** (`jsx/`) - Convert HTML to React JSX
- **HTML to Pug Converter** (`pug/`) - Transform HTML to Pug templates
- **HTML to Astro Converter** (`astro/`) - Convert HTML to Astro components
- **HTML Boilerplate Generator** (`boilerplate/`) - Generate HTML5 boilerplates
- **HTML Table Generator** (`table/`) - Create responsive HTML tables

### Text Tools (`src/features/tools/mdx/`)

- **MDX Editor** (`editor/`) - Live Markdown editor with preview

Each tool follows the same structure:

```
tool-name/
├── lib/                   # Core logic
├── ui/                    # UI components
├── types/                 # TypeScript types
└── tool-main.astro        # Main component
```

## 📁 Content Structure

Content is organized using Astro's content collections:

```
src/content/
├── posts/        # Main blog posts
├── howtos/       # Tutorial guides
├── snippets/     # Code snippets
└── friday/       # Friday link roundups
```

Each content type uses frontmatter for metadata and supports MDX for rich content.

## 🎨 Styling

- **CSS Variables**: Consistent theming with CSS custom properties
- **Dark/Light Mode**: Automatic theme switching
- **Responsive Design**: Mobile-first approach
- **Component Styles**: Scoped styles in Astro components

Styles are located in:

- `src/shared/styles/` - Global styles and variables
- Component-level styles within `.astro` files

## 🧩 Key Components

### Shared UI Components (`src/shared/ui/`)

- **Base Components**: Button, Badge, Card, etc.
- **Layout Components**: Breadcrumbs, Pagination, TOC
- **MDX Components**: Custom components for rich content

### Widgets (`src/widgets/`)

- **Header**: Navigation, search, theme switcher
- **Footer**: Links, social icons, site info

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the FSD architecture principles
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Follow the existing FSD structure
- Use TypeScript for type safety
- Write semantic, accessible HTML
- Keep components small and focused
- Add JSDoc comments for complex functions

## 🔧 Configuration

Main configuration files:

- `astro.config.mjs` - Astro configuration
- `src/app/config/site.ts` - Site-wide settings
- `src/app/config/tools.ts` - Tools configuration

## 📜 Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm dev:clean        # Clean install and dev

# Building
pnpm build            # Production build
pnpm preview          # Preview build

# Code Quality
pnpm lint             # Lint code
pnpm lint:fix         # Fix linting issues
pnpm prettier         # Format code
pnpm type-check       # TypeScript check
```

## 🌟 Live Site

Visit the live site at [jsdev.space](https://jsdev.space) to see this project in action!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Acknowledgments

- Built with [Astro](https://astro.build/)
- Follows [Feature-Sliced Design](https://feature-sliced.design/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by the JavaScript development community

---

**Made with ❤️ for developers, by developers. Originally crafted for [JSDev.Space](https://jsdev.space), now open for everyone to use, learn, and contribute!**
