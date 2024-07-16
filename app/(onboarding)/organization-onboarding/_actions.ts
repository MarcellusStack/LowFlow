"use server";

import { authedProcedure } from "@server/utils/procedures";
import { createOrganizationSchema } from "./_schemas";
import prisma from "@server/db";
import { revalidatePath } from "next/cache";

export const createOrganization = authedProcedure
  .createServerAction()
  .input(createOrganizationSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.organization.create({
        data: { name: input.name, users: { connect: { id: user.id } } },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath("/(onboarding)/organization-onboarding", "page");

    return { message: `Created Organization` };
  });
