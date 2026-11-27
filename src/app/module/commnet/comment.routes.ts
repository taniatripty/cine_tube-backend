import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { commentController } from "./comment.controller";
import {
  createCommentValidation,
  moderateCommentValidation,
  setCommentReactionValidation,
  updateCommentValidation,
} from "./commnent.validation";

const router = Router();

router.get("/all", commentController.getAllComments);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  commentController.getMyComments,
);

router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createCommentValidation),
  commentController.createComment,
);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(updateCommentValidation),
  commentController.updateComment,
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  commentController.deleteComment,
);

router.patch(
  "/:id/moderate",
  checkAuth(UserRole.ADMIN),
  validateRequest(moderateCommentValidation),
  commentController.moderateComment,
);

router.put(
  "/:id/reaction",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(setCommentReactionValidation),
  commentController.setCommentReaction,
);

router.delete(
  "/:id/reaction",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  commentController.removeCommentReaction,
);

export const commentRoutes = router;