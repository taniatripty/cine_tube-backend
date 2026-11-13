import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { streamingPlatformController } from "./streamingPlatform.controller";
import { createStreamingPlatformValidation } from "./streamingPlatform.validation";

const router = Router();

router.get(
  "/all",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  streamingPlatformController.getAllStreamingPlatforms,
);
router.post(
  "/",
  checkAuth(UserRole.ADMIN),
  validateRequest(createStreamingPlatformValidation),
  streamingPlatformController.createStreamingPlatform,
);

export const streamingPlatformRoutes = router;