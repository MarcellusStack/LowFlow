import { zodRequiredError } from "@constants/index";
import { generateErrorMessage } from "@utils/generate-error-message";
import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z
    .string()
    .min(1, { message: generateErrorMessage("Name", zodRequiredError) }),
  description: z.string(),
});
