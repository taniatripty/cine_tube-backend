import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { SubscriptionController } from "./subscription.controller";
import { createSubscriptionCheckoutValidation } from "./subscription.validation";

const router = Router();

router.post(
  "/checkout",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createSubscriptionCheckoutValidation),
  SubscriptionController.createCheckout,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  SubscriptionController.getMySubscriptions,
);

router.post(
  "/:subscriptionId/cancel",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  SubscriptionController.cancelSubscription,
);

export const subscriptionRoutes = router;