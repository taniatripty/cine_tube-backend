import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { personController } from "./person.controller";
import { createPersonValidation } from "./person.validation";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.ADMIN),
  validateRequest(createPersonValidation),
  personController.createPerson,
);

export const personRoutes = router;