import { zodRequiredError } from "@constants/index";
import { generateErrorMessage } from "@utils/generate-error-message";
import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, { message: generateErrorMessage("Name", zodRequiredError) }),
});
