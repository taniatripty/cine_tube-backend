import { z } from "zod";
import { createTagValidation } from "./tag.validation";

export type TCreateTagInput = z.infer<typeof createTagValidation>;