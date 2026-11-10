import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { mediaController } from "./media.controller";
import { createMediaValidation } from "./media.validation";

const router = Router();

router.get(
  "/all",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  mediaController.getAllMedia,
);
router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  mediaController.getMediaById,
);
router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createMediaValidation),
  mediaController.createMedia,
);

export const mediaRoutes = router;