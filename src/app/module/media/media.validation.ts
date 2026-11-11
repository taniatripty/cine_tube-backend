import { z } from "zod";
import {
  CreditRole,
  MediaStatus,
  MediaType,
} from "../../../generated/prisma/enums";

const mediaCreditValidation = z.object({
  personId: z.string().trim().min(1),
  role: z.enum(CreditRole),
  characterName: z.string().trim().nullable().optional(),
  displayOrder: z.number().int().nonnegative().default(0),
});

const mediaAvailabilityValidation = z
  .object({
    platformId: z.string().trim().min(1),
    streamingUrl: z.string().url(),
    region: z
      .string()
      .trim()
      .min(1)
      .transform((region) => region.toUpperCase())
      .default("GLOBAL"),
    availableFrom: z.coerce.date().nullable().optional(),
    availableUntil: z.coerce.date().nullable().optional(),
  })
  .refine(
    ({ availableFrom, availableUntil }) =>
      !availableFrom || !availableUntil || availableFrom <= availableUntil,
    {
      message: "availableFrom must be before or equal to availableUntil",
      path: ["availableUntil"],
    },
  );

export const createMediaValidation = z
  .object({
    title: z.string().trim().min(1),
    synopsis: z.string().trim().min(1),
    poster: z.string().trim().nullable().optional(),
    backdrop: z.string().trim().nullable().optional(),
    type: z.enum(MediaType),
    releaseDate: z.coerce.date().nullable().optional(),
    releaseYear: z.number().int().nullable().optional(),
    runtime: z.number().int().positive().nullable().optional(),
    isPremium: z.boolean().optional(),
    price: z.number().nonnegative().nullable().optional(),
    status: z.enum(MediaStatus).optional(),
    genreIds: z.array(z.string().trim().min(1)).optional(),
    credits: z.array(mediaCreditValidation).optional(),
    availabilities: z.array(mediaAvailabilityValidation).optional(),
  })
  .superRefine(({ genreIds, credits, availabilities }, context) => {
    if (genreIds && new Set(genreIds).size !== genreIds.length) {
      context.addIssue({
        code: "custom",
        message: "genreIds must not contain duplicates",
        path: ["genreIds"],
      });
    }

    const creditKeys = credits?.map(({ personId, role }) =>
      JSON.stringify([personId, role]),
    );
    if (creditKeys && new Set(creditKeys).size !== creditKeys.length) {
      context.addIssue({
        code: "custom",
        message: "A person cannot have the same credit role more than once",
        path: ["credits"],
      });
    }

    const availabilityKeys = availabilities?.map(
      ({ platformId, region }) => JSON.stringify([platformId, region]),
    );
    if (
      availabilityKeys &&
      new Set(availabilityKeys).size !== availabilityKeys.length
    ) {
      context.addIssue({
        code: "custom",
        message: "A platform can only have one availability per region",
        path: ["availabilities"],
      });
    }
  });
