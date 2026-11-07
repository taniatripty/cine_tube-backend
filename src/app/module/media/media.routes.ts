import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { mediaController } from "./media.controller";
import { createMovieValidation } from "./media.validation";

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
  "/movie",
  checkAuth(UserRole.ADMIN,UserRole.USER),
  validateRequest(createMovieValidation),
  mediaController.createMovie,
);

export const mediaRoutes = router;