export type CategoryInfo = {
  name: string;
  heading: string;
  description: string;
  metaDescription: string;
};

const categoriesWithDescriptionArr = [
  'javascript',
  'nestjs',
  'nextjs',
  'electron',
  'react',
  'nodejs',
  'html',
  'gatsby',
  'css',
  'typescript',
  'phaserjs',
  'bash',
  'git',
  'threejs',
  'design',
  'docker',
  'web3',
];

const categoriesWithDescription = new Set(categoriesWithDescriptionArr);

const normalize = (s: string) => s.replace(/^\/+|\/+$/g, '').trim().toLowerCase();

export const isCategory = (path: string): boolean => {
  return categoriesWithDescription.has(normalize(path));
};

const howtoCategoriesWithColors: Record<string, [string, string]> = {
  nodejs: ['#61994e', '#4c7d3c'],
  mongodb: ['#001E2B', '#0c516d'],
  javascript: ['#EFD81D', '#dfc113'],
  html: ['#DE4B25', '#d13d25'],
  eslint: ['#4930BD', '#5e44e7'],
  gatsby: ['#633194', '#7638b8'],
  design: ['#93C1F7', '#68a4f2'],
  typescript: ['#0376C6', '#0f96e8'],
  css: ['#2862E9', '#1f4dd6'],
  react: ['#0096c0', '#03779b'],
};

const DEFAULT_COLORS: [string, string] = ['#0f172a', '#334155'];

export const getHowtoCategoryColor = (category: string): [string, string] => {
  const key = normalize(category);
  return howtoCategoriesWithColors[key] || DEFAULT_COLORS;
};

export const getCategoryInfo = (categoryName: string, type = 'post'): CategoryInfo => {
  const cat = normalize(categoryName);

  let name = '';
  let heading = '';
  let description = '';
  let metaDescription = '';

  if (cat === 'javascript') {
    if (type === 'howto') {
      name = 'Mastering JavaScript: Essential Techniques for Web Developers';
      heading = 'JavaScript How‑To: Practical Patterns and Tips';
      description = 'Short guides on DOM, async code, and tooling. Clear steps, small examples, and real fixes you can use today.';
      metaDescription = 'JavaScript how‑to guides for DOM, async/await, and tooling. Simple steps and small examples for daily work.';
    } else {
      name = 'JavaScript';
      heading = 'JavaScript: Build Interactive, Fast Websites';
      description = 'Articles on modern JS, from ES6+ basics to app structure and performance. Learn faster, ship better UI.';
      metaDescription = 'Learn modern JavaScript: ES6+, performance, and app structure. Build fast, interactive interfaces.';
    }
  }

  if (cat === 'web3') {
    if (type === 'howto') {
      name = 'Mastering Web3: Building Secure, Scalable dApps';
      heading = 'Web3 How‑To: Contracts, Wallets, Deployments';
      description = 'Step‑by‑step patterns for Solidity, testing, wallets, and L2s. Ship safer, cheaper, and faster dApps.';
      metaDescription = 'Web3 how‑to: Solidity, testing, wallets, L2s, and deploys. Practical steps to ship secure dApps.';
    } else {
      name = 'Web3';
      heading = 'Web3: Contracts, Wallets, Real Apps';
      description = 'Guides on contracts, frontend integration, storage, and security. Make useful dApps that people trust.';
      metaDescription = 'Web3 tutorials on contracts, wallets, storage, and security. Build useful, trusted dApps.';
    }
  }

  if (cat === 'phaserjs') {
    if (type === 'howto') {
      name = 'Master PhaserJS Game Development';
      heading = 'PhaserJS How‑To: Build and Optimize 2D Games';
      description = 'Create 2D games with sprites, physics, and sound. Learn scenes, input, and performance tricks.';
      metaDescription = 'PhaserJS how‑to: sprites, physics, scenes, input, and performance for web games.';
    } else {
      name = 'PhaserJS';
      heading = 'PhaserJS: Fast 2D Games in the Browser';
      description = 'Tips for rendering, animation, and asset handling. Ship smooth, small, and fun browser games.';
      metaDescription = 'PhaserJS guides for rendering, animation, and assets. Build smooth web games.';
    }
  }

  if (cat === 'css') {
    if (type === 'howto') {
      name = 'Advanced CSS Techniques';
      heading = 'CSS How‑To: Layouts, Variables, and Tricks';
      description = 'Use Grid and Flexbox, tune typography, and add safe animations. Clean, responsive CSS that scales.';
      metaDescription = 'CSS how‑to: Grid, Flexbox, variables, and animations. Build clean, responsive layouts.';
    } else {
      name = 'CSS';
      heading = 'CSS: Modern Layouts and Styles';
      description = 'Learn layouts, theming, and performance basics. Style apps that look sharp and load fast.';
      metaDescription = 'CSS tutorials on layouts, theming, and performance. Create fast, clean designs.';
    }
  }

  if (cat === 'gatsby') {
    if (type === 'howto') {
      name = 'GatsbyJS Tutorial';
      heading = 'Gatsby How‑To: Data, Images, and Speed';
      description = 'Connect data with GraphQL, optimize images, and deploy. Make static sites that feel instant.';
      metaDescription = 'Gatsby how‑to: GraphQL, images, and deploys. Build static sites that load fast.';
    } else {
      name = 'GatsbyJS';
      heading = 'GatsbyJS: Fast React Sites';
      description = 'Guides for data sourcing, builds, and SEO. Scale content without slowing down.';
      metaDescription = 'GatsbyJS guides on data, builds, and SEO. Create fast React sites.';
    }
  }

  if (cat === 'nestjs') {
    if (type === 'howto') {
      name = 'NestJS Framework Guide';
      heading = 'NestJS How‑To: Modules, DI, and Testing';
      description = 'Build APIs with modules and dependency injection. Add guards, pipes, and clean tests.';
      metaDescription = 'NestJS how‑to: modules, DI, guards, pipes, and tests. Build clean APIs.';
    } else {
      name = 'NestJS';
      heading = 'NestJS: Scalable Server Apps';
      description = 'Articles on API design, microservices, and performance. Strong types, stable code.';
      metaDescription = 'NestJS tutorials on APIs, microservices, and performance. Ship scalable backends.';
    }
  }

  if (cat === 'nextjs') {
    if (type === 'howto') {
      name = 'NextJS Development Guide';
      heading = 'Next.js How‑To: Routing, Data, and SEO';
      description = 'Use file‑based routes, SSG/SSR, and caching. Faster pages, better SEO, simpler deploys.';
      metaDescription = 'Next.js how‑to: routing, SSG/SSR, caching, and SEO. Build fast pages.';
    } else {
      name = 'NextJS';
      heading = 'Next.js: React for Production';
      description = 'Learn rendering modes, API routes, and images. Build fast apps that scale on Vercel or anywhere.';
      metaDescription = 'Next.js tutorials on SSR/SSG, API routes, and images. Build fast, scalable apps.';
    }
  }

  if (cat === 'llm') {
    if (type === 'howto') {
      name = 'Optimizing LLM Performance';
      heading = 'LLM How‑To: Prompts, Tuning, and Costs';
      description = 'Write clearer prompts, cache results, and pick the right model size. Better answers, lower spend.';
      metaDescription = 'LLM how‑to: prompts, tuning, caching, and model choice. Improve quality and cut costs.';
    } else {
      name = 'LLM Models';
      heading = 'LLMs: Practical AI for Apps';
      description = 'Guides on use cases, safety, and evaluation. Add AI that helps, not hurts UX.';
      metaDescription = 'LLM guides on use cases, safety, and evals. Add AI features that users enjoy.';
    }
  }

  if (cat === 'electron') {
    if (type === 'howto') {
      name = 'Optimizing ElectronJS Apps';
      heading = 'Electron How‑To: Startup, Memory, and Security';
      description = 'Shrink bundles, lazy‑load, and isolate work. Keep apps fast and safe on all platforms.';
      metaDescription = 'Electron how‑to: reduce bundles, improve startup, and harden security for desktop apps.';
    } else {
      name = 'ElectronJS';
      heading = 'Electron: Web Tech on Desktop';
      description = 'Learn main vs renderer, packaging, and updates. Ship reliable cross‑platform apps.';
      metaDescription = 'Electron tutorials on processes, packaging, and updates. Build reliable desktop apps.';
    }
  }

  if (cat === 'react') {
    if (type === 'howto') {
      name = 'Optimizing ReactJS';
      heading = 'React How‑To: State, Memo, and Splitting';
      description = 'Cut re‑renders, split code, and cache work. Patterns that keep UIs smooth and small.';
      metaDescription = 'React how‑to: memoization, code splitting, and state patterns for smooth UIs.';
    } else {
      name = 'ReactJS';
      heading = 'React: Build Dynamic Interfaces';
      description = 'Posts on hooks, state, and app structure. Make components that are simple and fast.';
      metaDescription = 'React tutorials on hooks, state, and structure. Build simple, fast UIs.';
    }
  }

  if (cat === 'nodejs') {
    if (type === 'howto') {
      name = 'Optimizing NodeJS';
      heading = 'Node.js How‑To: Async, Caching, and Scaling';
      description = 'Use async I/O, cache hot paths, and add workers. APIs handle more with less CPU.';
      metaDescription = 'Node.js how‑to: async I/O, caching, and workers. Scale APIs efficiently.';
    } else {
      name = 'NodeJS';
      heading = 'Node.js: Fast Backends in JS';
      description = 'Guides on REST/GraphQL, streams, and perf. Build small services that feel big.';
      metaDescription = 'Node.js tutorials on APIs, streams, and performance. Build fast backends.';
    }
  }

  if (cat === 'html') {
    if (type === 'howto') {
      name = 'Optimizing HTML';
      heading = 'HTML How‑To: Semantics, Media, and Speed';
      description = 'Use clean tags, lazy‑load media, and trim markup. Pages get faster and easier to read.';
      metaDescription = 'HTML how‑to: semantic tags, lazy media, and lean markup for speed and clarity.';
    } else {
      name = 'HTML';
      heading = 'HTML: Structure That Works';
      description = 'Basics that matter: headings, lists, forms, and a11y. Strong structure helps users and SEO.';
      metaDescription = 'HTML tutorials on structure and a11y. Build pages that help users and SEO.';
    }
  }

  if (cat === 'typescript') {
    if (type === 'howto') {
      name = 'Optimizing TypeScript';
      heading = 'TypeScript How‑To: Types, Builds, and DX';
      description = 'Use strict types, speed up builds, and trim bundles. Fewer bugs, faster feedback.';
      metaDescription = 'TypeScript how‑to: strict types, faster builds, and smaller bundles.';
    } else {
      name = 'TypeScript';
      heading = 'TypeScript: Safer JavaScript';
      description = 'Short guides on types, generics, and tooling. Write clearer code that scales.';
      metaDescription = 'TypeScript tutorials on types, generics, and tooling. Write clearer code.';
    }
  }

  if (cat === 'bash') {
    if (type === 'howto') {
      name = 'Optimizing Bash Scripts';
      heading = 'Bash How‑To: Fast, Safe Automation';
      description = 'Prefer built‑ins, avoid forks, and add checks. Scripts run faster and fail less.';
      metaDescription = 'Bash how‑to: built‑ins, fewer forks, and safe checks for faster scripts.';
    } else {
      name = 'bash';
      heading = 'Bash: Automate Your Routine';
      description = 'Learn core tools, pipes, and patterns. Build scripts that save hours.';
      metaDescription = 'Bash tutorials on tools, pipes, and patterns. Automate tasks with simple scripts.';
    }
  }

  if (cat === 'git') {
    if (type === 'howto') {
      name = 'Optimizing Git Workflow';
      heading = 'Git How‑To: Branches, Commits, and History';
      description = 'Use clear branches, clean commits, and safe rebases. Teams move faster with fewer conflicts.';
      metaDescription = 'Git how‑to: branching, clean commits, and rebasing. Work faster with fewer conflicts.';
    } else {
      name = 'git';
      heading = 'Git: Version Control That Scales';
      description = 'Guides on everyday flows and tricky merges. Learn habits that keep repos healthy.';
      metaDescription = 'Git tutorials on flows, merges, and hygiene. Keep repos healthy.';
    }
  }

  if (cat === 'threejs') {
    if (type === 'howto') {
      name = 'Optimizing ThreeJS';
      heading = 'Three.js How‑To: FPS and Visual Quality';
      description = 'Use instancing, LOD, and compressed textures. Smoother scenes with less memory.';
      metaDescription = 'Three.js how‑to: instancing, LOD, and texture compression for smooth scenes.';
    } else {
      name = 'ThreeJS';
      heading = 'Three.js: 3D for the Web';
      description = 'Learn scenes, lights, and cameras with small demos. Build interactive 3D quickly.';
      metaDescription = 'Three.js tutorials on scenes, lights, and cameras. Build interactive 3D.';
    }
  }

  if (cat === 'design') {
    if (type === 'howto') {
      name = 'Optimizing Design';
      heading = 'Design How‑To: Hierarchy, Type, and Motion';
      description = 'Use clear hierarchy, readable type, and gentle motion. Clean UI that users trust.';
      metaDescription = 'Design how‑to: hierarchy, typography, and motion for clear, trusted UI.';
    } else {
      name = 'Design';
      heading = 'Design: Simple, Clear, Fast';
      description = 'Short lessons on layout, color, and accessibility. Make interfaces that feel right.';
      metaDescription = 'Design tutorials on layout, color, and a11y. Create interfaces that feel right.';
    }
  }

  if (cat === 'docker') {
    if (type === 'howto') {
      name = 'Optimizing Docker';
      heading = 'Docker How‑To: Images, Caching, and Limits';
      description = 'Use multi‑stage builds, cache layers, and set limits. Smaller images, faster runs, safer apps.';
      metaDescription = 'Docker how‑to: multi‑stage builds, caching, and resource limits for smaller, faster images.';
    } else {
      name = 'Docker';
      heading = 'Docker: Ship Anywhere, Quickly';
      description = 'Guides on images, networks, and security basics. Reliable deploys with less toil.';
      metaDescription = 'Docker tutorials on images, networks, and security. Ship reliable apps faster.';
    }
  }

  if (!name || !heading || !description || !metaDescription) {
    name = 'Unknown Category';
    heading = 'Unknown Category';
    description = 'Description not available for this category.';
    metaDescription = 'Meta description not available for this category.';
  }

  return { name, heading, description, metaDescription } as CategoryInfo;
};
