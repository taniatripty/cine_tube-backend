import { z } from "zod";
import { createSeasonValidation } from "./season.validation";

export type TCreateSeasonInput = z.infer<typeof createSeasonValidation>;