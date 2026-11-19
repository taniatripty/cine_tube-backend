import { z } from "zod";
import { createCommentValidation } from "./commnent.validation";

export type TCreateCommentInput = z.infer<typeof createCommentValidation>;