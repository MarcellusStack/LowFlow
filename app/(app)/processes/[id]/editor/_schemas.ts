import { z } from "zod";

export const updateProcessEditorSchema = z.object({
  id: z.string().min(1),
  fields: z.any(),
});
