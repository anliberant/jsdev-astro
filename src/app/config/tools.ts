import { FileText, Code, Table, Wrench, Hash, PenTool, FileCode, Archive } from '@lucide/astro';

export const toolsHtml: ToolInfo[] = [
  {
    title: 'HTML to JSX Converter',
    description: 'Convert HTML to JSX with camelCase props, fragments, and formatting options.',
    href: '/tools/html-to-jsx/',
    icon: Code,
  },
  {
    title: 'HTML to Pug Converter', 
    description: 'Transform HTML markup into clean, indented Pug template syntax.',
    href: '/tools/html-to-pug/',
    icon: FileCode,
  },
  {
    title: 'HTML to Astro Converter',
    description: 'Convert HTML to Astro component format with frontmatter support.',
    href: '/tools/html-to-astro/', 
    icon: Archive,
  },
  {
    title: 'HTML ⇄ Markdown Converter',
    description: 'Bidirectional converter between HTML and Markdown with table support and formatting options.',
    href: '/tools/html-markdown/',
    icon: FileText,
  },
  {
    title: 'HTML Boilerplate Generator',
    description: 'Generate customized HTML5 boilerplates with meta tags and structure.',
    href: '/tools/html-boilerplate/',
    icon: PenTool,
  },
  {
    title: 'HTML Table Generator',
    description: 'Create responsive HTML tables with headers, styling, and export options.',
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