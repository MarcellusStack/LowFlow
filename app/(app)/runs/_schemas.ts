import { z } from "zod";

export const createRunSchema = z.object({
  workflow: z.object({
    name: z.string().min(1),
    id: z.string().min(1),
  }),
});
