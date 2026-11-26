import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { multerUpload } from "../../config/multer.confing";
import { mediaController } from "./media.controller";
import {
  createMediaValidation,
  updateMediaStatusValidation,
} from "./media.validation";

const router = Router();

router.get(
  "/all",

  mediaController.getAllMedia,
);
router.get(
  "/:id",
  
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

router.patch(
  "/:id/status",
  checkAuth(UserRole.ADMIN),
  validateRequest(updateMediaStatusValidation),
  mediaController.updateMediaStatus,
);

export const mediaRoutes = router;