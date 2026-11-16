import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { seasonController } from "./season.controller";
import { createSeasonValidation } from "./season.validation";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.ADMIN),
  validateRequest(createSeasonValidation),
  seasonController.createSeason,
);

export const seasonRoutes = router;