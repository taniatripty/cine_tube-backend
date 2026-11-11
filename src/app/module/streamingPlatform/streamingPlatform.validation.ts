import { z } from "zod";

export const createStreamingPlatformValidation = z.object({
  name: z.string().trim().min(1),
  logo: z.string().url().nullable().optional(),
  website: z.string().url().nullable().optional(),
});