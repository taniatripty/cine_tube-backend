import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { tagController } from "./tag.controller";
import { createTagValidation } from "./tag.validation";

const router = Router();



router.get(
  "/all",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  tagController.getAllTags,
);

router.post(
  "/",
  checkAuth(UserRole.ADMIN),
  validateRequest(createTagValidation),
  tagController.createTag,
);

export const tagRoutes = router;