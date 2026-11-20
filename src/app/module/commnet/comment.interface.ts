import { z } from "zod";
import {
  createCommentValidation,
  moderateCommentValidation,
  setCommentReactionValidation,
} from "./commnent.validation";

export type TCreateCommentInput = z.infer<typeof createCommentValidation>;
export type TModerateCommentInput = z.infer<typeof moderateCommentValidation>;
export type TSetCommentReactionInput = z.infer<
  typeof setCommentReactionValidation
>;