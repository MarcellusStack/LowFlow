"use server";

import { authFilterQuery } from "@server/utils/query-clients";
import prisma from "@server/db";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { authedProcedure } from "@server/utils/procedures";
import { z } from "zod";
import { callN8nWebhook } from "@server/utils/call-n8n-webhook";

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
          orderBy: {
            process: {
              order: "asc",
            },
          },
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

export const completeWorkflowRun = authedProcedure
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
              status: {
                notIn: ["completed", "archived"],
              },
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
                  n8nCompleteWorkflows: {
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

          if (run.workflow.n8nCompleteWorkflows.length > 0) {
            const combinedSubmissionData = Object.assign(
              {},
              ...run.processRuns.map((processRun) => processRun.submission.data)
            );

            await Promise.all(
              run.workflow.n8nCompleteWorkflows.map(async (workflow) => {
                await callN8nWebhook({
                  workflowName: workflow.name,
                  submissionData: combinedSubmissionData,
                });
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

export const resetWorkflowRun = authedProcedure
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
              status: "completed",
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
                  n8nOngoingWorkflows: {
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

          if (run.workflow.n8nOngoingWorkflows.length > 0) {
            const combinedSubmissionData = Object.assign(
              {},
              ...run.processRuns.map((processRun) => processRun.submission.data)
            );

            await Promise.all(
              run.workflow.n8nOngoingWorkflows.map(async (workflow) => {
                await callN8nWebhook({
                  workflowName: workflow.name,
                  submissionData: combinedSubmissionData,
                });
              })
            );
          }

          await tx.workflowRun.update({
            where: {
              id: input.workflowRunId,
              organizationId: user.organizationId,
            },
            data: {
              status: "ongoing",
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

    return { message: `Reset Workflow Run` };
  });

export const archiveWorkflowRun = authedProcedure
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
                  n8nArchiveWorkflows: {
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

          if (!run || run.processRuns.length === 0) {
            throw new Error("Workflow run not found or no process runs found");
          }

          if (run.workflow.n8nArchiveWorkflows.length > 0) {
            const combinedSubmissionData = Object.assign(
              {},
              ...run.processRuns.map((processRun) => processRun.submission.data)
            );

            await Promise.all(
              run.workflow.n8nArchiveWorkflows.map(async (workflow) => {
                await callN8nWebhook({
                  workflowName: workflow.name,
                  submissionData: combinedSubmissionData,
                });
              })
            );
          }

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
