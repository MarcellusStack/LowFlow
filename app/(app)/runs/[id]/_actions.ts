"use server";

import { authFilterQuery } from "@server/utils/query-clients";
import prisma from "@server/db";
import { cache } from "react";

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
                n8nWorkflowIds: true,
              },
            },
          },
        },
      },
    });
  })
);

export type RunsProps = NonNullable<Awaited<ReturnType<typeof getWorkflowRun>>>;
