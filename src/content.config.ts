import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const newsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    thumbnail: z.string(),
    excerpt: z.string(),
  }),
});

const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    thumbnail: z.string(),
    excerpt: z.string(),
  }),
});

const galleryCollection = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/gallery" }),
  schema: z.object({
    image: z.string(),
    category: z.enum(["Publications", "Special Events", "Books"]),
    caption: z.string().optional(),
  }),
});

export const collections = {
  news: newsCollection,
  articles: articlesCollection,
  gallery: galleryCollection,
};
