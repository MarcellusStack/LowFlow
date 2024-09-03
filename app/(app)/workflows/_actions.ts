"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { createWorkflowSchema } from "./_schemas";
import { authFilterQuery } from "@server/utils/query-clients";
import { getReadPermissions } from "@utils/get-read-permissions";

export const getWorkflows = authFilterQuery(async (user, search) => {
  // Determine if the user can read all workflows or specific ones
  const { canReadAll, specificEntityIds } = getReadPermissions(
    user,
    "workflow"
  );

  return await prisma.workflow.findMany({
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
      AND: [
        {
          OR: [
            // Case 1: User can read all workflows
            canReadAll
              ? {}
              : {
                  // Case 2: User can read specific workflows
                  id: {
                    in: specificEntityIds,
                  },
                },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
    },
  });
});

export type WorkflowProps = NonNullable<
  Awaited<ReturnType<typeof getWorkflows>>
>;

export const createWorkflow = authedProcedure
  .createServerAction()
  .input(createWorkflowSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.workflow.create({
        data: {
          name: input.name,
          description: input.description,
          approval: input.approval,
          organization: { connect: { id: user.organizationId } },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath("/(app)/workflows", "page");

    return { message: `Created Workflow` };
  });
