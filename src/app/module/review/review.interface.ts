import { z } from "zod";
import {
  createReviewValidation,
  moderateReviewValidation,
} from "./review.validation";

export type TCreateReviewInput = z.infer<typeof createReviewValidation>;
export type TModerateReviewInput = z.infer<typeof moderateReviewValidation>;