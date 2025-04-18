import { z } from "zod";

export const uploadedDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string(),
  content: z.string(),
});
export type UploadedDocument = z.infer<typeof uploadedDocumentSchema>;

export const chunkSchema = z.object({
  pre_context: z.string(),
  text: z.string(),
  post_context: z.string(),
  source_url: z.string(),
  source_description: z.string(),
  order: z.number(),
  category: z.string().optional(),
});
export type Chunk = z.infer<typeof chunkSchema>;

export const sourceSchema = z.object({
  chunks: z.array(chunkSchema),
  source_url: z.string(),
  source_description: z.string(),
});
export type Source = z.infer<typeof sourceSchema>;

export const citationSchema = z.object({
  source_url: z.string(),
  source_description: z.string(),
});
export type Citation = z.infer<typeof citationSchema>;
