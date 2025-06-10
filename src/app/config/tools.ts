import { FileText, Code, Table, Wrench, Hash, PenTool, FileCode, Archive, Scissors, PaintbrushIcon } from '@lucide/astro';

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
  {
    title: 'HTML Encoder & Decoder',
    description: 'Encode and decode HTML entities, special characters, and symbols bidirectionally.',
    href: '/tools/html-encoder-decoder/',
    icon: Code,
  },
  {
    title: 'HTML Tag Remover',
    description: 'Remove HTML tags from content while preserving text. Configure removal options and convert entities.',
    href: '/tools/html-tag-remover/',
    icon: Scissors,
  },
];

export const toolsText: ToolInfo[] = [
  {
    title: 'MDX Editor',
    description: 'Edit and preview Markdown content with live HTML output and syntax highlighting',
    href: '/tools/mdx-editor/',
    icon: FileText,
  },
];

export const toolsCss: ToolInfo[] = [
  {
    title: 'Neobrutalism CSS Button Generator',
    description: 'Create bold, eye-catching buttons with thick borders, vibrant colors, and dramatic shadows in the neobrutalism design style.',
    href: '/tools/neobrutalism-button',
    icon: PaintbrushIcon,
  },
];

export const allTools = [
  ...toolsHtml,
  ...toolsText,
  ...toolsCss,
];