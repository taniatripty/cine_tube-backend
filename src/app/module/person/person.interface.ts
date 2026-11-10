import { z } from "zod";
import { createPersonValidation } from "./person.validation";

export type TCreatePersonInput = z.infer<typeof createPersonValidation>;