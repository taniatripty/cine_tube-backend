import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { mediaController } from "./media.controller";
import { createMovieValidation } from "./media.validation";

const router = Router();

router.post(
  "/movie",
  checkAuth(UserRole.ADMIN,UserRole.USER),
  validateRequest(createMovieValidation),
  mediaController.createMovie,
);

export const mediaRoutes = router;