import { z } from "zod";
import {
  createCommentValidation,
  moderateCommentValidation,
  setCommentReactionValidation,
  updateCommentValidation,
} from "./commnent.validation";

export type TCreateCommentInput = z.infer<typeof createCommentValidation>;
export type TModerateCommentInput = z.infer<typeof moderateCommentValidation>;
export type TSetCommentReactionInput = z.infer<
  typeof setCommentReactionValidation
>;
export type TUpdateCommentInput = z.infer<typeof updateCommentValidation>;