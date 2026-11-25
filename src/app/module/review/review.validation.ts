import { z } from "zod";
import {
  ContentReactionType,
  ReviewStatus,
} from "../../../generated/prisma/enums";

const tagStringOrArray = z
  .union([z.array(z.string().trim().min(1)), z.string().trim().min(1)])
  .optional()
  .transform((val) => {
    if (!val) return undefined;
    if (typeof val === "string") {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return val;
  });

export const createReviewValidation = z.object({
  mediaId: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(1),
  isSpoiler: z.boolean().optional(),
  tagIds: z.array(z.string().trim().min(1)).optional(),
  tags: tagStringOrArray,
  tagNames: tagStringOrArray,
});

export const moderateReviewValidation = z.object({
  status: z.enum(ReviewStatus),
  moderationNote: z.string().trim().optional(),
});

export const setReviewReactionValidation = z.object({
  type: z.enum(ContentReactionType),
});

export const updateReviewValidation = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  content: z.string().trim().min(1).optional(),
  isSpoiler: z.boolean().optional(),
  tagIds: z.array(z.string().trim().min(1)).optional(),
  tags: tagStringOrArray,
  tagNames: tagStringOrArray,
});