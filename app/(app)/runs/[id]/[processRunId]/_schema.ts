import { z } from "zod";

export const updateRunSchema = z.object({
  processRunId: z.string().min(1),
  data: z.any(),
});

export const runSchema = z.object({
  processRunId: z.string().min(1),
});
