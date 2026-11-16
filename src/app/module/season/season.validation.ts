import { z } from "zod";

export const createSeasonValidation = z.object({
  mediaId: z.string().trim().min(1),
  seasonNumber: z.coerce.number().int().positive(),
  title: z.string().trim().min(1).optional(),
});