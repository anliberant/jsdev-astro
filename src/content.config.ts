import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts/' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(65, {
        message: 'Title cannot be longer than 65 characters',
      }),
      desc: z.string().max(165, {
        message: 'Description cannot be longer than 165 characters',
      }),
      heading: z.string(),
      author: z.string(),
      date: z.date(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      image: image(),
      permalink: z.string(),
      slug: z.string(),
      isDraft: z.boolean().optional(),
    }),
});

const howtos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/howtos/' }),
  schema: ({ image }) => z.object({
    title: z.string().max(65, {
      message: 'Title cannot be longer than 65 characters',
    }),
    desc: z.string().max(165, {
      message: 'Description cannot be longer than 165 characters',
    }),
    heading: z.string(),
    author: z.string(),
    icon: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    permalink: z.string(),
    slug: z.string(),
    type: z.literal('howto'),
  }),
});

const fridays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/friday/' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(65, {
        message: 'Title cannot be longer than 65 characters',
      }),
      desc: z.string().max(165, {
        message: 'Description cannot be longer than 165 characters',
      }),
      slug: z.string(),
      heading: z.string(),
      author: z.string(),
      date: z.date(),
      image: image(),
      permalink: z.string(),
      type: z.literal('friday'),
    }),
});

const snippets = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/snippets/' }),
  schema: z.object({
    title: z.string().max(65, {
      message: 'Title cannot be longer than 65 characters',
    }),
    desc: z.string().max(165, {
      message: 'Description cannot be longer than 165 characters',
    }),
    slug: z.string(),
    heading: z.string(),
    author: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    icon: z.string().optional(),
    permalink: z.string(),
    type: z.literal('snippets'),
  }),
});

export const collections = {
  posts,
  howtos,
  fridays,
  snippets,
};
