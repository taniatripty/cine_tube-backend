import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { multerUpload } from "../../config/multer.confing";
import { mediaController } from "./media.controller";
import { createMediaValidation } from "./media.validation";

const router = Router();

router.get(
  "/all",
 checkAuth(UserRole.ADMIN,UserRole.USER),
  mediaController.getAllMedia,
);
router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  mediaController.getMediaById,
);
router.post(
  "/",
  checkAuth(UserRole.ADMIN),
  multerUpload.fields([
    { name: "poster", maxCount: 1 },
    { name: "backdrop", maxCount: 1 },
  ]),
  validateRequest(createMediaValidation),
  mediaController.createMedia,
);

export const mediaRoutes = router;