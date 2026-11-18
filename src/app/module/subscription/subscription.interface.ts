import { z } from "zod";
import { createSubscriptionValidation } from "./subscription.validation";

export type TCreateSubscriptionInput = z.infer<
  typeof createSubscriptionValidation
>;