import { z } from "zod";

export const createWatchListValidation = z
  .object({
    mediaId: z.string().trim().min(1).optional(),
    title: z.string().trim().min(1).optional(),
  })
  .refine(({ mediaId, title }) => Boolean(mediaId || title), {
    message: "Either mediaId or title is required",
    path: ["mediaId"],
  });