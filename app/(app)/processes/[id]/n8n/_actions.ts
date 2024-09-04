"use server";
import { processN8nSchema } from "@schemas/index";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { authFilterQuery } from "@server/utils/query-clients";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getProcessN8ns = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.process.findFirst({
      where: {
        id: search.id,
        organizationId: user.organizationId,
      },
      select: {
        n8nCompleteWorkflows: {
          select: {
            id: true,
            workflowId: true,
            name: true,
            description: true,
          },
        },
        n8nOngoingWorkflows: {
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
  Awaited<ReturnType<typeof getProcessN8ns>>
>;

export const connectN8nCompletedProcessWorkflow = authedProcedure
  .createServerAction()
  .input(processN8nSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.process.update({
        where: { id: input.id, organizationId: user.organizationId },
        data: {
          n8nCompleteWorkflows: {
            connect: {
              id: input.n8nWorkflow.id,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/processes/${input.id}/n8n`, "page");

    return { message: `Connected N8n` };
  });

export const disconnectN8nCompletedProcessWorkflow = authedProcedure
  .createServerAction()
  .input(processN8nSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.process.update({
        where: { id: input.id, organizationId: user.organizationId },
        data: {
          n8nCompleteWorkflows: {
            disconnect: {
              id: input.n8nWorkflow.id,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/processes/${input.id}/n8n`, "page");

    return { message: `Disconnected n8n` };
  });

export const connectN8nOngoingProcessWorkflow = authedProcedure
  .createServerAction()
  .input(processN8nSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.process.update({
        where: { id: input.id, organizationId: user.organizationId },
        data: {
          n8nOngoingWorkflows: {
            connect: {
              id: input.n8nWorkflow.id,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/processes/${input.id}/n8n`, "page");

    return { message: `Connected N8n` };
  });

export const disconnectN8nOngoingProcessWorkflow = authedProcedure
  .createServerAction()
  .input(processN8nSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.process.update({
        where: { id: input.id, organizationId: user.organizationId },
        data: {
          n8nOngoingWorkflows: {
            disconnect: {
              id: input.n8nWorkflow.id,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/processes/${input.id}/n8n`, "page");

    return { message: `Disconnected n8n` };
  });
