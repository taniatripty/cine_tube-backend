import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { reviewController } from "./review.controller";
import {
  createReviewValidation,
  moderateReviewValidation,
} from "./review.validation";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createReviewValidation),
  reviewController.createReview,
);

router.patch(
  "/:id/moderate",
  checkAuth(UserRole.ADMIN),
  validateRequest(moderateReviewValidation),
  reviewController.moderateReview,
);

export const reviewRoutes = router;