// import MdxImage from './MdxImage.astro';
import Code from './code.astro';
import Codepen from './codepen.astro';
import InlineRelated from './inline-related.astro';
import MdxBlockquote from './mdx-blockquote.astro';
import MdxLink from './mdx-link.astro';
import MdxListItem from './mdx-list-item.astro';
import MdxList from './mdx-list.astro';
import ReversedCounterDemo from './reversed-counter-demo.astro';
import Youtube from './youtube.astro';

export const mdxComponents = {
  // img: MdxImage,
  a: MdxLink,
  pre: Code,
  Codepen,
  Youtube,
  InlineRelated,
  ul: MdxList,
  li: MdxListItem,
  quote: MdxBlockquote,
  ReversedCounterDemo,
};
