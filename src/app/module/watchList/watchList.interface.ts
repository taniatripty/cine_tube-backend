import { z } from "zod";
import { createWatchListValidation } from "./watchList.validation";


export type TCreateWatchListInput = z.infer<
  typeof createWatchListValidation
>;