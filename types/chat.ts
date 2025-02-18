import { z } from "zod";
import { citationSchema } from "./data";

export const displayMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  citations: z.array(citationSchema).default([]),
});
export type DisplayMessage = z.infer<typeof displayMessageSchema>;

export const chatSchema = z.object({
  messages: z.array(displayMessageSchema),
});
export type Chat = z.infer<typeof chatSchema>;

export const indicatorIconTypeSchema = z.enum([
  "thinking",
  "searching Donald's Brain",
  "understanding",
  "documents",
  "none",
  "error",
]);
export type IndicatorIconType = z.infer<typeof indicatorIconTypeSchema>;

export const loadingIndicatorSchema = z.object({
  status: z.string(),
  icon: indicatorIconTypeSchema,
});
export type LoadingIndicator = z.infer<typeof loadingIndicatorSchema>;
