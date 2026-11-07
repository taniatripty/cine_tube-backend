import { z } from "zod";
import { createGenreValidation } from "./genre.validation";

export type TCreateGenreInput = z.infer<typeof createGenreValidation>;