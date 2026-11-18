import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PaymentController } from "./payment.controller";
import { createMediaCheckoutValidation } from "./payment.validation";

const router = Router();

router.post(
  "/media/checkout",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createMediaCheckoutValidation),
  PaymentController.createMediaCheckout,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  PaymentController.getMyPayments,
);

export const paymentRoutes = router;