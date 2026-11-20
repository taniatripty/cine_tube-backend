import { z } from "zod";
import {
  createReviewValidation,
  moderateReviewValidation,
  setReviewReactionValidation,
} from "./review.validation";

export type TCreateReviewInput = z.infer<typeof createReviewValidation>;
export type TModerateReviewInput = z.infer<typeof moderateReviewValidation>;
export type TSetReviewReactionInput = z.infer<
  typeof setReviewReactionValidation
>;