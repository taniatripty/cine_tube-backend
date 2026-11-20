import { z } from "zod";
import {
  createCommentValidation,
  moderateCommentValidation,
} from "./commnent.validation";

export type TCreateCommentInput = z.infer<typeof createCommentValidation>;
export type TModerateCommentInput = z.infer<typeof moderateCommentValidation>;