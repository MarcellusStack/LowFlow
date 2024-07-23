"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { createWorkflowSchema } from "./_schemas";
import { authFilterQuery } from "@server/utils/query-clients";

export const getWorkflows = authFilterQuery(async (user, search) => {
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
          organization: { connect: { id: user.organizationId } },
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath("/(app)/workflows", "page");

    return { message: `Created Workflow` };
  });
