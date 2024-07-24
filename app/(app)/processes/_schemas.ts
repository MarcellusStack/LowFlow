import { zodRequiredError } from "@constants/index";
import { generateErrorMessage } from "@utils/generate-error-message";
import { z } from "zod";

export const processSchema = z.object({
  name: z
    .string()
    .min(1, { message: generateErrorMessage("Name", zodRequiredError) }),
  description: z.string(),
  status: z
    .string()
    .min(1, { message: generateErrorMessage("Status", zodRequiredError) }),
  workflow: z.object({ id: z.string().min(1), name: z.string().min(1) }),
});

export const updateProcessSchema = z.intersection(
  processSchema,
  z.object({ id: z.string().min(1) })
);
