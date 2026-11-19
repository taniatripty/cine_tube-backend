import { z } from "zod";

export const createCommentValidation = z.object({
  reviewId: z.string().trim().min(1),
  parentId: z.string().trim().min(1).nullable().optional(),
  content: z.string().trim().min(1),
});