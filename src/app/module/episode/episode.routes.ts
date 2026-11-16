import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.confing";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { episodeController } from "./episode.controller";
import { createEpisodeValidation } from "./episode.validation";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.ADMIN),
  multerUpload.single("thumbnail"),
  validateRequest(createEpisodeValidation),
  episodeController.createEpisode,
);

export const episodeRoutes = router;