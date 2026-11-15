import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { personController } from "./person.controller";
import { createPersonValidation } from "./person.validation";
import { multerUpload } from "../../config/multer.confing";

const router = Router();

router.get(
  "/all",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  personController.getAllPeople,
);
router.post(
  "/",
  multerUpload.single("file"),
  checkAuth(UserRole.ADMIN),
validateRequest(createPersonValidation),
  personController.createPerson,
);

export const personRoutes = router;