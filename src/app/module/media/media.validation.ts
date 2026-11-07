import { z } from "zod";

export const createMovieValidation = z.object({
  title: z.string().trim().min(1),
  synopsis: z.string().trim().min(1),
  poster: z.string().trim().nullable().optional(),
  backdrop: z.string().trim().nullable().optional(),
  releaseDate: z.coerce.date().nullable().optional(),
  releaseYear: z.number().int().nullable().optional(),
  runtime: z.number().int().positive().nullable().optional(),
  isPremium: z.boolean().optional(),
  price: z.number().nonnegative().nullable().optional(),
  genreIds: z.array(z.string().trim().min(1)).optional(),
});
