import { z } from "zod";
import { createSubscriptionCheckoutValidation } from "./subscription.validation";

export type TCreateSubscriptionCheckoutInput = z.infer<
  typeof createSubscriptionCheckoutValidation
>;