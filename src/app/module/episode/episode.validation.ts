import { z } from "zod";

export const createEpisodeValidation = z.object({
  seasonId: z.string().trim().min(1),
  episodeNumber: z.coerce.number().int().positive(),
  title: z.string().trim().min(1),
  synopsis: z.string().trim().nullable().optional(),
  runtime: z.coerce.number().int().positive().nullable().optional(),
  thumbnail: z.string().trim().nullable().optional(),
  videoUrl: z.string().trim().nullable().optional(),
});