import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { contentReportController } from "./contentReport.controller";
import { createContentReportValidation } from "./contentReport.validation";


const router = Router();

router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createContentReportValidation),
  contentReportController.createContentReport,
);

export const contentReportRoutes = router;