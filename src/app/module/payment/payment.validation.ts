import { z } from "zod";
import { AccessType } from "../../../generated/prisma/enums";

export const createMediaCheckoutValidation = z.object({
  mediaId: z.string().trim().min(1),
  accessType: z.enum([
    AccessType.PURCHASE,
    AccessType.RENT_MONTH,
    AccessType.RENT_YEAR,
  ]),
});

