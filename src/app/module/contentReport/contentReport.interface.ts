import { z } from "zod";
import { createContentReportValidation } from "./contentReport.validation";

export type TCreateContentReportInput = z.infer<
  typeof createContentReportValidation
>;