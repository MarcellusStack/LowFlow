"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { authFilterQuery } from "@server/utils/query-clients";
import { cache } from "react";
import { updateWorkflowSchema } from "./_schemas";
import { PresentationStatus } from "@prisma/client";
import { deleteSchema } from "@schemas/index";
import { redirect } from "next/navigation";

export const getWorkflow = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.workflow.findUnique({
      where: {
        id: search.id,
        organizationId: user.organizationId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
    });
  })
);

export type WorkflowProps = NonNullable<
  Awaited<ReturnType<typeof getWorkflow>>
>;

export const updateWorkflow = authedProcedure
  .createServerAction()
  .input(updateWorkflowSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.workflow.update({
        where: { id: input.id, organizationId: user.organizationId },
        data: {
          name: input.name,
          description: input.description,
          status: input.status as PresentationStatus,
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/workflows/${input.id}`, "page");

    return { message: `Updated Workflow` };
  });

export const deleteWorkflow = authedProcedure
  .createServerAction()
  .input(deleteSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.workflow.delete({
        where: { id: input.id, organizationId: user.organizationId },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    redirect("/workflows");
  });
