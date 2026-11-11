import { z } from "zod";
import { createStreamingPlatformValidation } from "./streamingPlatform.validation";

export type TCreateStreamingPlatformInput = z.infer<
  typeof createStreamingPlatformValidation
>;