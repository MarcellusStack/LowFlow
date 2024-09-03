"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { authFilterQuery } from "@server/utils/query-clients";
import { cache } from "react";
import { PresentationStatus } from "@prisma/client";
import { deleteSchema } from "@schemas/index";
import {
  updateWorkflowProcessesSchema,
  workflowProcessesSchema,
} from "./_schemas";
import { z } from "zod";

export const getWorkflowProcesses = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.process.findMany({
      where: {
        workflowId: search.id,
        organizationId: user.organizationId,
        ...(search.search
          ? {
              OR: [
                { name: { contains: search.search, mode: "insensitive" } },
                {
                  description: {
                    contains: search.search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        workflowId: true,
        n8nWorkflows: {
          select: {
            id: true,
          },
        },
        fields: true,
      },
    });
  })
);

export type WorkflowProcessesProps = NonNullable<
  Awaited<ReturnType<typeof getWorkflowProcesses>>
>;

export const createWorkflowProcesses = authedProcedure
  .createServerAction()
  .input(workflowProcessesSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      // Query the existing processes to determine the maximum order value
      const maxOrderProcess = await prisma.process.findFirst({
        where: {
          workflowId: input.workflowId,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });

      const newOrder = maxOrderProcess ? maxOrderProcess.order + 1000 : 1000;

      await prisma.process.create({
        data: {
          name: input.name,
          description: input.description,
          status: input.status as PresentationStatus,
          order: newOrder,
          workflow: {
            connect: {
              id: input.workflowId,
            },
          },
          organization: {
            connect: {
              id: user.organizationId,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/workflows/${input.workflowId}/processes`, "page");

    return { message: `Created Process` };
  });

export const updateWorkflowProcesses = authedProcedure
  .createServerAction()
  .input(updateWorkflowProcessesSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.process.update({
        where: {
          id: input.id,
          organizationId: user.organizationId,
        },
        data: {
          name: input.name,
          description: input.description,
          status: input.status as PresentationStatus,
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/workflows/${input.workflowId}/processes`, "page");

    return { message: `Updated Process` };
  });

export const deleteWorkflowProcess = authedProcedure
  .createServerAction()
  .input(deleteSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      const process = await prisma.process.delete({
        where: { id: input.id, organizationId: user.organizationId },
        select: {
          workflowId: true,
        },
      });

      revalidatePath(
        `/(app)/workflows/${process.workflowId}/processes`,
        "page"
      );
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    return { message: `Deleted Process` };
  });

export const moveUp = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string().min(1) }))
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      // Find the current process
      const currentProcess = await prisma.process.findUnique({
        where: { id: input.id, organizationId: user.organizationId },
        select: {
          id: true,
          order: true,
          workflowId: true,
        },
      });

      if (!currentProcess) {
        throw new Error("Process not found");
      }

      // Find the process immediately above the current process
      const aboveProcess = await prisma.process.findFirst({
        where: {
          workflowId: currentProcess.workflowId,
          organizationId: user.organizationId,
          order: { lt: currentProcess.order },
        },
        orderBy: { order: "desc" },
        select: {
          id: true,
          order: true,
        },
      });

      if (!aboveProcess) {
        throw new Error("No process above to move up");
      }

      // Swap the order values
      await prisma.$transaction([
        prisma.process.update({
          where: { id: currentProcess.id },
          data: { order: aboveProcess.order },
        }),
        prisma.process.update({
          where: { id: aboveProcess.id },
          data: { order: currentProcess.order },
        }),
      ]);

      revalidatePath(
        `/(app)/workflows/${currentProcess.workflowId}/processes`,
        "page"
      );
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    return { message: `Moved Process Up` };
  });
export const moveDown = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string().min(1) }))
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      // Find the current process
      const currentProcess = await prisma.process.findUnique({
        where: { id: input.id, organizationId: user.organizationId },
        select: {
          id: true,
          order: true,
          workflowId: true,
        },
      });

      if (!currentProcess) {
        throw new Error("Process not found");
      }

      // Find the process immediately below the current process
      const belowProcess = await prisma.process.findFirst({
        where: {
          workflowId: currentProcess.workflowId,
          organizationId: user.organizationId,
          order: { gt: currentProcess.order },
        },
        orderBy: { order: "asc" },
        select: {
          id: true,
          order: true,
        },
      });

      if (!belowProcess) {
        throw new Error("No process below to move down");
      }

      // Swap the order values
      await prisma.$transaction([
        prisma.process.update({
          where: { id: currentProcess.id },
          data: { order: belowProcess.order },
        }),
        prisma.process.update({
          where: { id: belowProcess.id },
          data: { order: currentProcess.order },
        }),
      ]);

      revalidatePath(
        `/(app)/workflows/${currentProcess.workflowId}/processes`,
        "page"
      );
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    return { message: `Moved Process Down` };
  });
