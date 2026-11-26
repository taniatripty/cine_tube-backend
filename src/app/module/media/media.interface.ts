import { z } from "zod";
import {
  createMediaValidation,
  updateMediaStatusValidation,
} from "./media.validation";

export type TCreateMediaInput = z.infer<typeof createMediaValidation>;
export type TUpdateMediaStatusInput = z.infer<
  typeof updateMediaStatusValidation
>;