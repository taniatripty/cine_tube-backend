import { z } from "zod";
import { createEpisodeValidation } from "./episode.validation";

export type TCreateEpisodeInput = z.infer<typeof createEpisodeValidation>;