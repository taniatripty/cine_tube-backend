import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { MediaAccessController } from "./mediaAccess.controller";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  MediaAccessController.getMyAccess,
);

router.get(
  "/check/:mediaId",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  MediaAccessController.checkMyAccess,
);

router.patch(
  "/:accessId/revoke",
  checkAuth(UserRole.ADMIN),
  MediaAccessController.revokeAccess,
);

export const mediaAccessRoutes = router;