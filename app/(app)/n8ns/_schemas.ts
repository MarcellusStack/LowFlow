import { z } from "zod";

export const createN8nSchema = z.object({
  n8nWorkflow: z.object({
    name: z.string().min(1),
    id: z.string().min(1),
  }),
  description: z.string(),
});
