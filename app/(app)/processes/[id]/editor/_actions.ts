"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { authFilterQuery } from "@server/utils/query-clients";
import { cache } from "react";
import { updateProcessEditorSchema } from "./_schemas";

export const getProcessEditor = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.process.findFirst({
      where: {
        id: search.id,
        organizationId: user.organizationId,
      },
      select: {
        id: true,
        status: true,
        workflowId: true,
        fields: true,
      },
    });
  })
);

export type ProcessEditorProps = NonNullable<
  Awaited<ReturnType<typeof getProcessEditor>>
>;

export const updateProcessEditor = authedProcedure
  .createServerAction()
  .input(updateProcessEditorSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;
      console.log(input);

      await prisma.process.update({
        where: {
          id: input.id,
          organizationId: user.organizationId,
        },
        data: {
          fields: input.fields,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/processes/${input.id}/editor`, "page");

    return { message: `Updated Process` };
  });
