import { Atom, FileCode, Layout, Rocket, Table, FileText } from '@lucide/astro';

export const toolsHtml = [
  {
    title: 'HTML to Pug',
    description: 'Convert HTML markup to clean Pug template syntax quickly and easily',
    href: '/tools/html-to-pug/',
    icon: FileCode,
  },
  {
    title: 'HTML to Astro',
    description: 'Convert static HTML markup to Astro component syntax with proper frontmatter and component structure',
    href: '/tools/html-to-astro/',
    icon: Rocket,
  },
  {
    title: 'HTML to JSX',
    description: 'Transform HTML elements to JSX syntax for React components with automatic attribute conversion',
    href: '/tools/html-to-jsx/',
    icon: Atom,
  },
  {
    title: 'HTML Boilerplate Generator',
    description: 'Generate complete HTML5 boilerplate with meta tags, CSS links, and JavaScript includes',
    href: '/tools/html-boilerplate/',
    icon: Layout,
  },
  {
    title: 'HTML Table Generator',
    description: 'Create customizable HTML tables with headers, styling options, and responsive design',
    href: '/tools/html-table-generator/',
    icon: Table,
  },
];

export const toolsText = [
  {
    title: 'MDX Editor',
    description: 'Edit and preview Markdown content with live HTML output and syntax highlighting',
    href: '/tools/mdx-editor/',
    icon: FileText,
  },
];

export const allTools = [
  ...toolsHtml,
  ...toolsText,
];