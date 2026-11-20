import { z } from "zod";
import {
  ContentReactionType,
  ReviewStatus,
} from "../../../generated/prisma/enums";

export const createReviewValidation = z.object({
  mediaId: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(1),
  isSpoiler: z.boolean().optional(),
});

export const moderateReviewValidation = z.object({
  status: z.enum(ReviewStatus),
  moderationNote: z.string().trim().optional(),
});

export const setReviewReactionValidation = z.object({
  type: z.enum(ContentReactionType),
});