import { z } from "zod";
import { updateProfileValidation } from "./user.validation";

export type TUpdateProfileInput = z.infer<typeof updateProfileValidation>;
