import { z } from "zod";

export const deleteSchema = z.object({
  id: z.string().min(1),
});



export const processN8nSchema = z.object({
  n8nWorkflow: z.object({
    name: z.string().min(1),
    id: z.string().min(1),
  }),
  id: z.string().min(1),
});