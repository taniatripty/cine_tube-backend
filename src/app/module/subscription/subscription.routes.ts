import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { subscriptionController } from "./subscription.controller";
import { createSubscriptionValidation } from "./subscription.validation";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createSubscriptionValidation),
  subscriptionController.createSubscription,
);

export const subscriptionRoutes = router;