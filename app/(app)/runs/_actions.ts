"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { createRunSchema } from "./_schemas";
import { authFilterQuery } from "@server/utils/query-clients";
import { deleteSchema } from "@schemas/index";
import { z } from "zod";

export const getRuns = authFilterQuery(async (user, search) => {
  return await prisma.workflowRun.findMany({
    where: {
      organizationId: user.organizationId,
    },
    select: {
      id: true,
      workflow: {
        select: {
          name: true,
        },
      },
      status: true,
    },
  });
});

export type RunsProps = NonNullable<Awaited<ReturnType<typeof getRuns>>>;

export const createRun = authedProcedure
  .createServerAction()
  .input(createRunSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.$transaction(
        async (tx) => {
          const workflow = await tx.workflow.findUnique({
            where: {
              id: input.workflow.id,
              organizationId: user.organizationId,
            },
            select: {
              id: true,
              processes: {
                select: {
                  id: true,
                },
              },
            },
          });

          if (!workflow || workflow.processes.length === 0) {
            throw new Error("Workflow not found or has no processes");
          }

          const newWorkflowRun = await tx.workflowRun.create({
            data: {
              workflow: {
                connect: {
                  id: workflow.id,
                },
              },
              organization: {
                connect: {
                  id: user.organizationId,
                },
              },
              processRuns: {
                create: workflow.processes.map((process) => ({
                  processId: process.id,
                  organizationId: user.organizationId,
                })),
              },
            },
            select: {
              processRuns: {
                select: {
                  id: true,
                },
              },
            },
          });

          await tx.submission.createMany({
            data: newWorkflowRun.processRuns.map((processRun) => ({
              organizationId: user.organizationId,
              processRunId: processRun.id,
            })),
          });
        },
        {
          maxWait: 15000,
          timeout: 15000,
        }
      );
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/runs`, "page");

    return { message: `Created Run` };
  });

export const deleteRun = authedProcedure
  .createServerAction()
  .input(deleteSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.workflowRun.delete({
        where: { id: input.id, organizationId: user.organizationId },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/runs`, "page");

    return { message: `Deleted Run` };
  });
