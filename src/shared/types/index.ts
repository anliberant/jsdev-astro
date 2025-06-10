import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

export interface BaseComponentProps {
  class?: string;
  [key: string]: any;
}

export interface ButtonProps extends BaseComponentProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'convert'
    | 'clear'
    | 'copy'
    | 'sample';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  copied?: boolean;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export interface ConversionStats {
  lines: number;
  characters: number;
}

export interface BaseConverterElements {
  errorMessage: HTMLElement;
  successMessage: HTMLElement;
}

export interface HtmlToJsxElements extends BaseConverterElements {
  htmlInput: HTMLTextAreaElement;
  jsxOutput: HTMLTextAreaElement;
  inputStats: HTMLElement;
  outputStats: HTMLElement;
  options: {
    prettify: HTMLInputElement;
    camelCase: HTMLInputElement;
    fragment: HTMLInputElement;
  };
}

export interface HtmlToPugElements extends BaseConverterElements {
  htmlInput: HTMLTextAreaElement;
  pugOutput: HTMLTextAreaElement;
  inputStats: HTMLElement;
  outputStats: HTMLElement;
  options: {
    prettify: HTMLInputElement;
    combineText: HTMLInputElement;
    preserveComments: HTMLInputElement;
  };
}

export interface HtmlToAstroElements extends BaseConverterElements {
  htmlInput: HTMLTextAreaElement;
  astroOutput: HTMLTextAreaElement;
  inputStats?: HTMLElement;
  outputStats?: HTMLElement;
}

export interface BoilerplateConfig {
  title: string;
  description?: string;
  author?: string;
}

export interface JsxConversionOptions {
  prettify: boolean;
  camelCase: boolean;
  useFragment: boolean;
}

export interface PugConversionOptions {
  prettify: boolean;
  combineText: boolean;
  preserveComments: boolean;
}

export interface CategoryInfo {
  name: string;
  heading: string;
  description: string;
  metaDescription: string;
}

export interface HowtoCategoryInfo {
  name: string;
  color: string;
  secondColor: string;
  description: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface ContentNode {
  frontmatter: {
    title: string;
    permalink: string;
    [key: string]: any;
  };
  excerpt: string;
}

// Tool types
export interface ToolInfo {
  title: string;
  description: string;
  href: string;
  icon: AstroComponentFactory;
}

export interface ConverterOption {
  id: string;
  label: string;
  checked?: boolean;
}

export interface ConverterButton {
  id: string;
  label: string;
  variant: 'convert' | 'clear' | 'copy' | 'sample';
  icon?: string;
}

export interface ConverterPanelProps {
  type: 'input' | 'output';
  title: string;
  icon?: string;
  textareaId: string;
  placeholder?: string;
  readonly?: boolean;
  showSampleButton?: boolean;
  showStats?: boolean;
}

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

export interface ImageMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
}

export interface PostData {
  title: string;
  desc: string;
  heading: string;
  author: string;
  date: Date;
  category: string;
  tags: string[];
  image: ImageMetadata;
  permalink: string;
  slug: string;
  isDraft?: boolean;
}

export interface HowtoData extends PostData {
  icon: string;
  type: 'howto';
}

export interface SnippetData extends PostData {
  icon?: string;
  type: 'snippets';
}

export interface FridayData {
  title: string;
  desc: string;
  slug: string;
  heading: string;
  author: string;
  date: Date;
  image: ImageMetadata;
  permalink: string;
  type: 'friday';
}

export interface HtmlMarkdownElements extends BaseConverterElements {
  htmlInput: HTMLTextAreaElement;
  markdownOutput: HTMLTextAreaElement;
  inputStats: HTMLElement;
  outputStats: HTMLElement;
  modeToggle: HTMLInputElement;
  inputLabel: HTMLElement;
  outputLabel: HTMLElement;
}