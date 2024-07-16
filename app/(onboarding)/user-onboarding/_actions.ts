"use server";

import { authedProcedure } from "@server/utils/procedures";
import { userOnboardingSchema } from "./_schemas";
import prisma from "@server/db";
import { revalidatePath } from "next/cache";

export const updateUserOnboarding = authedProcedure
  .createServerAction()
  .input(userOnboardingSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.user.update({
        where: { id: user.id },
        data: { firstName: input.firstName, lastName: input.lastName },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath("/(onboarding)/user-onboarding", "page");

    return { message: `Onboarding completed` };
  });
