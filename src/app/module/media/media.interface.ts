import { z } from "zod";
import { createMovieValidation } from "./media.validation";

export type TCreateMovieInput = z.infer<typeof createMovieValidation>;