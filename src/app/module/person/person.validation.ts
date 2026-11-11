import { z } from "zod";

export const createPersonValidation = z.object({
  name: z.string().trim().min(1),
  photo: z.string().trim().nullable().optional(),
  biography: z.string().trim().nullable().optional(),
});