"use server";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { authFilterQuery } from "@server/utils/query-clients";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { processN8nSchema } from "./_schemas";

export const getWorkflowN8ns = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.workflow.findFirst({
      where: {
        id: search.id,
        organizationId: user.organizationId,
      },
      select: {
        n8nWorkflows: {
          select: {
            id: true,
            workflowId: true,
            name: true,
            description: true,
          },
        },
        id: true,
      },
    });
  })
);

export type ProcessN8nsProps = NonNullable<
  Awaited<ReturnType<typeof getWorkflowN8ns>>
>;

export const createWorkflowN8n = authedProcedure
  .createServerAction()
  .input(processN8nSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.workflow.update({
        where: { id: input.id, organizationId: user.organizationId },
        data: {
          n8nWorkflows: {
            connect: {
              id: input.n8nWorkflow.id,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/workflows/${input.id}/n8n`, "page");

    return { message: `Connected N8n` };
  });

export const deleteWorkflowN8n = authedProcedure
  .createServerAction()
  .input(processN8nSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.workflow.update({
        where: { id: input.id, organizationId: user.organizationId },
        data: {
          n8nWorkflows: {
            disconnect: {
              id: input.n8nWorkflow.id,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/workflows/${input.id}/n8n`, "page");

    return { message: `Disconnected n8n` };
  });
