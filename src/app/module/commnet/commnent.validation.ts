import { z } from "zod";
import { CommentStatus } from "../../../generated/prisma/enums";

export const createCommentValidation = z.object({
  reviewId: z.string().trim().min(1),
  parentId: z.string().trim().min(1).nullable().optional(),
  content: z.string().trim().min(1),
});

export const moderateCommentValidation = z.object({
  status: z.enum(CommentStatus),
});