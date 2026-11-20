import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { commentController } from "./comment.controller";
import {
  createCommentValidation,
  moderateCommentValidation,
} from "./commnent.validation";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createCommentValidation),
  commentController.createComment,
);

router.patch(
  "/:id/moderate",
  checkAuth(UserRole.ADMIN),
  validateRequest(moderateCommentValidation),
  commentController.moderateComment,
);

export const commentRoutes = router;