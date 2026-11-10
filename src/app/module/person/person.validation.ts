import { z } from "zod";

export const createPersonValidation = z.object({
  biography: z.string().trim().nullable().optional(),
});