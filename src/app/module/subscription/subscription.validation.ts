import { z } from "zod";

export const createSubscriptionValidation = z.object({
  stripePriceId: z.string().trim().min(1),
});