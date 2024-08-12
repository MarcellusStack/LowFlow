"use server";

import { authFilterQuery } from "@server/utils/query-clients";
import prisma from "@server/db";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { authedProcedure } from "@server/utils/procedures";
import { z } from "zod";

export const getWorkflowRun = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.workflowRun.findUnique({
      where: {
        id: search.id,
        organizationId: user.organizationId,
      },
      select: {
        id: true,
        status: true,
        workflow: {
          select: {
            name: true,
            description: true,
          },
        },
        processRuns: {
          select: {
            id: true,
            submission: true,
            status: true,
            process: {
              select: {
                id: true,
                name: true,
                description: true,
                fields: true,
              },
            },
          },
        },
      },
    });
  })
);

export type RunsProps = NonNullable<Awaited<ReturnType<typeof getWorkflowRun>>>;

export const completeRun = authedProcedure
  .createServerAction()
  .input(z.object({ workflowRunId: z.string() }))
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;

    try {
      await prisma.$transaction(
        async (tx) => {
          const run = await tx.workflowRun.findUnique({
            where: {
              id: input.workflowRunId,
              organizationId: user.organizationId,
            },
            select: {
              id: true,
              processRuns: {
                select: {
                  id: true,
                  status: true,
                  submission: {
                    select: {
                      data: true,
                    },
                  },
                },
              },
              workflow: {
                select: {
                  id: true,
                  n8nWorkflows: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          });

          if (!run || run.processRuns.length === 0) {
            throw new Error("Workflow run not found or no process runs found");
          }

          const allProcessRunsCompleted = run.processRuns.every(
            (processRun) => processRun.status === "completed"
          );

          if (!allProcessRunsCompleted) {
            const incompleteProcessRuns = run.processRuns.filter(
              (processRun) => processRun.status !== "completed"
            );

            await Promise.all(
              incompleteProcessRuns.map((processRun) =>
                tx.processRun.update({
                  where: {
                    id: processRun.id,
                    organizationId: user.organizationId,
                  },
                  data: {
                    status: "incomplete",
                  },
                })
              )
            );

            await tx.workflowRun.update({
              where: {
                id: input.workflowRunId,
                organizationId: user.organizationId,
              },
              data: {
                status: "incomplete",
              },
            });

            revalidatePath(`/(app)/runs/${run.workflowRunId}`, "page");
            return { message: `Not all process runs are completed` };
          }

          if (run.workflow.n8nWorkflows.length > 0) {
            const combinedSubmissionData = run.processRuns.map(
              (processRun) => processRun.submission.data
            );

            await Promise.all(
              run.workflow.n8nWorkflows.map(async (workflow) => {
                const url = `${process.env.NEXT_PUBLIC_N8N_URL}/webhook/${workflow.name}`;

                const response = await fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-N8N-WEBHOOK-API-KEY": process.env.N8N_API_KEY as string,
                  },
                  body: JSON.stringify(combinedSubmissionData),
                });

                if (!response.ok) {
                  throw new Error(`Failed to send data to ${workflow.name}`);
                }
              })
            );
          }

          await tx.workflowRun.update({
            where: {
              id: input.workflowRunId,
              organizationId: user.organizationId,
            },
            data: {
              status: "completed",
            },
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

    revalidatePath(`/(app)/runs/${input.workflowRunId}`, "page");

    return { message: `Completed Run` };
  });

export const archiveRun = authedProcedure
  .createServerAction()
  .input(z.object({ workflowRunId: z.string() }))
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;

    try {
      await prisma.$transaction(
        async (tx) => {
          const run = await tx.workflowRun.findUnique({
            where: {
              id: input.workflowRunId,
              organizationId: user.organizationId,
            },
            select: {
              id: true,
              processRuns: {
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          });

          if (!run || run.processRuns.length === 0) {
            throw new Error("Workflow run not found or no process runs found");
          }

          await Promise.all(
            run.processRuns.map((processRun) =>
              tx.processRun.update({
                where: {
                  id: processRun.id,
                  organizationId: user.organizationId,
                },
                data: {
                  status: "archived",
                },
              })
            )
          );

          await tx.workflowRun.update({
            where: {
              id: input.workflowRunId,
              organizationId: user.organizationId,
            },
            data: {
              status: "archived",
            },
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

    revalidatePath(`/(app)/runs/${input.workflowRunId}`, "page");
    return { message: `Archived Run` };
  });
