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
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        workflowId: true,
        n8nWorkflowIds: true,
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

      await prisma.process.create({
        data: {
          name: input.name,
          description: input.description,
          status: input.status as PresentationStatus,
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
