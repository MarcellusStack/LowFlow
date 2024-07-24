"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { processSchema, updateProcessSchema } from "./_schemas";
import { authFilterQuery } from "@server/utils/query-clients";
import { z } from "zod";
import { PresentationStatus } from "@prisma/client";
import { deleteSchema } from "@schemas/index";
import { cache } from "react";

export const getProcesses = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.process.findMany({
      where: {
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
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
        n8nWorkflowIds: true,
      },
    });
  })
);

export type ProcessesProps = NonNullable<
  Awaited<ReturnType<typeof getProcesses>>
>;

export const createProcess = authedProcedure
  .createServerAction()
  .input(processSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.process.create({
        data: {
          name: input.name,
          description: input.description,
          status: input.status as PresentationStatus,
          organization: { connect: { id: user.organizationId } },
          workflow: { connect: { id: input.workflow.id } },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath("/(app)/processes", "page");

    return { message: `Created Process` };
  });

export const updateProcess = authedProcedure
  .createServerAction()
  .input(updateProcessSchema)
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
          workflow: {
            connect: {
              id: input.workflow.id,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/processes`, "page");

    return { message: `Updated Process` };
  });

export const deleteProcess = authedProcedure
  .createServerAction()
  .input(deleteSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.process.delete({
        where: { id: input.id, organizationId: user.organizationId },
      });

      revalidatePath(`/(app)/processes`, "page");
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    return { message: `Deleted Process` };
  });

export const getWorkflowsAction = authedProcedure
  .createServerAction()
  .input(z.object({ search: z.string().optional() }))
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      const workflows = await prisma.workflow.findMany({
        where: {
          organizationId: user.organizationId,
          ...(input.search ? { name: { contains: input.search } } : {}),
        },
        select: {
          id: true,
          name: true,
        },
        take: 25,
      });

      return {
        workflows: workflows,
        message: "Standorte geladen",
      };
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }
  });
