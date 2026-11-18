import { z } from "zod";

export const createSubscriptionCheckoutValidation = z.object({
  stripePriceId: z.string().trim().min(1),
});