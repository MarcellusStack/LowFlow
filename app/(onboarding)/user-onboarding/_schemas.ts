import { zodRequiredError } from "@constants/index";
import { generateErrorMessage } from "@utils/generate-error-message";
import { z } from "zod";

export const userOnboardingSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: generateErrorMessage("Firstname", zodRequiredError) }),
  lastName: z
    .string()
    .min(1, { message: generateErrorMessage("Lastname", zodRequiredError) }),
});
