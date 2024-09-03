"use server";

import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { authFilterQuery } from "@server/utils/query-clients";
import { revalidatePath } from "next/cache";
import { runSchema, updateRunSchema } from "./_schema";

export const getProcessRun = authFilterQuery(async (user, search) => {
  return await prisma.processRun.findUnique({
    where: {
      id: search.processRunId,
      organizationId: user.organizationId,
    },
    select: {
      id: true,
      process: {
        select: {
          fields: true,
        },
      },
      submission: {
        select: {
          id: true,
          data: true,
        },
      },
      status: true,
    },
  });
});

export type RunsProps = NonNullable<Awaited<ReturnType<typeof getProcessRun>>>;

export const updateRun = authedProcedure
  .createServerAction()
  .input(updateRunSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.$transaction(
        async (tx) => {
          // Fetch the process run details along with workflow and previous process run details
          const run = await tx.processRun.findUnique({
            where: {
              id: input.processRunId,
              organizationId: user.organizationId,
              status: {
                notIn: ["completed", "archived"],
              },
            },
            select: {
              workflowRunId: true,
              processId: true,
              submission: {
                select: {
                  id: true,
                  data: true,
                },
              },
              process: {
                select: {
                  workflowId: true,
                  order: true,
                  n8nWorkflows: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              workflowRun: {
                select: {
                  workflow: {
                    select: {
                      approval: true,
                      processes: {
                        orderBy: {
                          order: "asc",
                        },
                        select: {
                          id: true,
                          order: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          if (!run) {
            throw new Error(
              "Process run not found or is in a completed/archived state."
            );
          }

          const workflow = run.workflowRun.workflow;
          const processes = workflow.processes;

          // Check if approval is required and if the previous process has been completed
          if (workflow.approval) {
            const currentProcessIndex = processes.findIndex(
              (p) => p.id === run.processId
            );
            if (currentProcessIndex > 0) {
              const previousProcessId = processes[currentProcessIndex - 1].id;
              const previousProcessRun = await tx.processRun.findUnique({
                where: {
                  workflowRunId_processId: {
                    workflowRunId: run.workflowRunId,
                    processId: previousProcessId,
                  },
                  organizationId: user.organizationId,
                },
                select: {
                  status: true,
                },
              });

              if (
                !previousProcessRun ||
                previousProcessRun.status !== "completed"
              ) {
                throw new Error(
                  "Approval required: You must complete the previous process before updating this one."
                );
              }
            }
          }

          // Update the workflow run and process run
          await tx.workflowRun.update({
            where: {
              id: run.workflowRunId,
              organizationId: user.organizationId,
            },
            data: {
              status: "ongoing",
              processRuns: {
                update: {
                  where: {
                    id: input.processRunId,
                    organizationId: user.organizationId,
                  },
                  data: {
                    status: "ongoing",
                    submission: {
                      update: {
                        where: {
                          id: run.submission.id,
                          organizationId: user.organizationId,
                        },
                        data: {
                          data: input.data,
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          revalidatePath(
            `/(app)/runs/${run.workflowRunId}/${input.processRunId}`,
            "page"
          );
        },
        {
          maxWait: 15000,
          timeout: 15000,
        }
      );
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    return { message: `Updated Run` };
  });

export const completeRun = authedProcedure
  .createServerAction()
  .input(runSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.$transaction(
        async (tx) => {
          const run = await tx.processRun.findUnique({
            where: {
              id: input.processRunId,
              organizationId: user.organizationId,
              status: {
                notIn: ["completed", "archived", "open"],
              },
            },
            select: {
              workflowRunId: true,
              submission: {
                select: {
                  id: true,
                  data: true,
                },
              },
              process: {
                select: {
                  n8nWorkflows: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          });

          if (run.process.n8nWorkflows.length > 0) {
            const submissionData = run.submission.data;

            await Promise.all(
              run.process.n8nWorkflows.map(async (workflow) => {
                const url = `${process.env.NEXT_PUBLIC_N8N_URL}/webhook/${workflow.name}`;

                const response = await fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-N8N-WEBHOOK-API-KEY": process.env.N8N_API_KEY as string,
                  },
                  body: JSON.stringify(submissionData),
                });

                if (!response.ok) {
                  throw new Error(`Failed to send data to ${workflow.name}`);
                }
              })
            );
          }

          await tx.processRun.update({
            where: {
              id: input.processRunId,
              organizationId: user.organizationId,
            },
            data: {
              status: "completed",
            },
          });

          revalidatePath(
            `/(app)/runs/${run.workflowRunId}/${input.processRunId}`,
            "page"
          );
        },
        {
          maxWait: 15000,
          timeout: 15000,
        }
      );
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    return { message: `Completed Run` };
  });

export const resetRun = authedProcedure
  .createServerAction()
  .input(runSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.$transaction(
        async (tx) => {
          const run = await tx.processRun.findUnique({
            where: {
              id: input.processRunId,
              organizationId: user.organizationId,
              status: "completed",
              workflowRun: {
                status: {
                  notIn: ["completed", "archived"],
                },
              },
            },
            select: {
              workflowRunId: true,
              submission: {
                select: {
                  id: true,
                },
              },
            },
          });

          await tx.processRun.update({
            where: {
              id: input.processRunId,
              organizationId: user.organizationId,
            },
            data: {
              status: "ongoing",
            },
          });

          revalidatePath(
            `/(app)/runs/${run.workflowRunId}/${input.processRunId}`,
            "page"
          );
        },
        {
          maxWait: 15000,
          timeout: 15000,
        }
      );
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    return { message: `Reseted Run` };
  });
