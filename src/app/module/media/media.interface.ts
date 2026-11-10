import { z } from "zod";
import { createMediaValidation } from "./media.validation";

export type TCreateMediaInput = z.infer<typeof createMediaValidation>;