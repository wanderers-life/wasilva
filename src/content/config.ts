import { defineCollection, z } from "astro:content";

const newsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    thumbnail: z.string(),
    excerpt: z.string(),
  }),
});

const galleryCollection = defineCollection({
  type: "data",
  schema: z.object({
    image: z.string(),
    category: z.enum(["Publications", "Special Events", "Books"]),
    caption: z.string().optional(),
  }),
});

const programsCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    image: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  news: newsCollection,
  gallery: galleryCollection,
  programs: programsCollection,
};
