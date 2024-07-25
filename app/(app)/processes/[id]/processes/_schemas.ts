import { zodRequiredError } from "@constants/index";
import { generateErrorMessage } from "@utils/generate-error-message";
import { z } from "zod";

export const workflowProcessesSchema = z.object({
  name: z
    .string()
    .min(1, { message: generateErrorMessage("Name", zodRequiredError) }),
  description: z.string(),
  status: z
    .string()
    .min(1, { message: generateErrorMessage("Status", zodRequiredError) }),
  workflowId: z.string().min(1),
});

export const updateWorkflowProcessesSchema = z.intersection(
  workflowProcessesSchema,
  z.object({ id: z.string().min(1) })
);
