import { z } from "zod";

export const createReviewValidation = z.object({
  mediaId: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(1),
  isSpoiler: z.boolean().optional(),
});