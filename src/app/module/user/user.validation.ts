import { z } from "zod";

export const updateProfileValidation = z.object({
  name: z.string().trim().min(1).optional(),
  image: z.string().trim().min(1).nullable().optional(),
});
