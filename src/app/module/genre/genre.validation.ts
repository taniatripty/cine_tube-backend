import { z } from "zod";

export const createGenreValidation = z.object({
  name: z.string().trim().min(1),
});
