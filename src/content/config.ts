import { defineCollection, z } from "astro:content";

const mealsSchema = z.object({
  name: z.string(),
  image: z.string(),
  url: z.string().optional(),
});

const meals = defineCollection({
  type: "content",
  schema: mealsSchema,
});

export type Meal = z.infer<typeof mealsSchema>;

export const collections = {
  meals,
};
