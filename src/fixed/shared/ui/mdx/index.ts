import Code from './code.astro';
import Codepen from './codepen.astro';
import MdxBlockquote from './mdx-blockquote.astro';
import MdxHeading from './mdx-heading.astro';
import MdxLink from './mdx-link.astro';
import MdxListItem from './mdx-list-item.astro';
import MdxList from './mdx-list.astro';
import Youtube from './youtube.astro';

export const mdxComponents = {
  a: MdxLink,
  pre: Code,
  Codepen,
  Youtube,
  ul: MdxList,
  li: MdxListItem,
  quote: MdxBlockquote
};