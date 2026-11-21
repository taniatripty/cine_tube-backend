import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { reviewController } from "./review.controller";
import {
  createReviewValidation,
  moderateReviewValidation,
  setReviewReactionValidation,
  updateReviewValidation,
} from "./review.validation";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  reviewController.getMyReviews,
);

router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createReviewValidation),
  reviewController.createReview,
);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(updateReviewValidation),
  reviewController.updateReview,
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  reviewController.deleteReview,
);

router.patch(
  "/:id/moderate",
  checkAuth(UserRole.ADMIN),
  validateRequest(moderateReviewValidation),
  reviewController.moderateReview,
);

router.put(
  "/:id/reaction",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(setReviewReactionValidation),
  reviewController.setReviewReaction,
);

router.delete(
  "/:id/reaction",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  reviewController.removeReviewReaction,
);

export const reviewRoutes = router;