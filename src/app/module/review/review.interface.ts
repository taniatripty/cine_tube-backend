import { z } from "zod";
import { createReviewValidation } from "./review.validation";

export type TCreateReviewInput = z.infer<typeof createReviewValidation>;