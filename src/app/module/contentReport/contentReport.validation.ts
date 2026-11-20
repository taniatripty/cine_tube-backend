import { z } from "zod";

export const createContentReportValidation = z.discriminatedUnion(
  "targetType",
  [
    z.object({
      targetType: z.literal("REVIEW"),
      reviewId: z.string().trim().min(1),
      reason: z.string().trim().min(1),
      description: z.string().trim().optional(),
    }),
    z.object({
      targetType: z.literal("COMMENT"),
      commentId: z.string().trim().min(1),
      reason: z.string().trim().min(1),
      description: z.string().trim().optional(),
    }),
  ],
);