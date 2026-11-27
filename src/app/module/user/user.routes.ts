import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.confing";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { userController } from "./user.controller";
import { updateProfileValidation } from "./user.validation";

const router = Router();

router.patch(
  "/profile",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  multerUpload.single("image"),
  validateRequest(updateProfileValidation),
  userController.updateProfile,
);

export const userRoutes = router;
