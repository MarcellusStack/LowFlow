import { z } from "zod";

export const workflowRunSchema = z.object({
  workflowId: z.string().min(1),
});
