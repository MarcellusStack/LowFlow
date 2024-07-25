import { zodRequiredError } from "@constants/index";
import { generateErrorMessage } from "@utils/generate-error-message";
import { z } from "zod";

export const updateWorkflowSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(1, { message: generateErrorMessage("Name", zodRequiredError) }),
  description: z.string(),
  status: z
    .string()
    .min(1, { message: generateErrorMessage("Status", zodRequiredError) }),
});
