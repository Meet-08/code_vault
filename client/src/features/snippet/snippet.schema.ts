import z from "zod";

export const snippetCreateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  language: z.string().min(1, { message: "Language is required" }).max(30, {
    message: "Language must be at most 30 characters",
  }),
  code: z.string().min(5, { message: "Code must be at least 5 characters" }),
  tags: z
    .array(z.string())
    .min(1, { message: "At least one tag is required" })
    .max(10, {
      message: "At most 10 tags are allowed",
    }),
});

export const snippetSearchSchema = z.object({
  q: z.string().optional(),
  language: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isFavourite: z.boolean().optional(),

  page: z
    .number()
    .default(1)
    .refine((n) => n > 0, { message: "Page must be greater than 0" }),

  size: z
    .number()
    .default(10)
    .refine((n) => n > 0 && n <= 100, {
      message: "Size must be between 1 and 100",
    }),

  sort: z.string().optional(),
});

export type SnippetCreate = z.infer<typeof snippetCreateSchema>;

export type SnippetSearch = z.infer<typeof snippetSearchSchema>;
