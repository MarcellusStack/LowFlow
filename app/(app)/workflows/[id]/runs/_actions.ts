"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { authFilterQuery } from "@server/utils/query-clients";
import { cache } from "react";
import { PresentationStatus } from "@prisma/client";
import { deleteSchema } from "@schemas/index";
import { workflowRunSchema } from "./_schemas";

export const getWorkflowRuns = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.workflowRun.findMany({
      where: {
        workflowId: search.id,
        organizationId: user.organizationId,
      },
      select: {
        id: true,
        status: true,
      },
    });
  })
);

export type WorkflowRunsProps = NonNullable<
  Awaited<ReturnType<typeof getWorkflowRuns>>
>;

export const createWorkflowRun = authedProcedure
  .createServerAction()
  .input(workflowRunSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.$transaction(
        async (tx) => {
          const workflow = await tx.workflow.findUnique({
            where: {
              id: input.workflowId,
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

          const processRuns = await tx.workflowRun.create({
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
            data: processRuns.processRuns.map((processRun) => ({
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

    revalidatePath(`/(app)/workflows/${input.workflowId}/processes`, "page");

    return { message: `Created Process` };
  });

export const deleteWorkflowRun = authedProcedure
  .createServerAction()
  .input(deleteSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      const run = await prisma.workflowRun.delete({
        where: { id: input.id, organizationId: user.organizationId },
        select: {
          workflowId: true,
        },
      });

      revalidatePath(`/(app)/workflows/${run.workflowId}/runs`, "page");
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    return { message: `Deleted Run` };
  });
