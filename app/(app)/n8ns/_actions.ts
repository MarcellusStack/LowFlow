"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { authFilterQuery } from "@server/utils/query-clients";
import { deleteSchema } from "@schemas/index";
import { createN8nSchema } from "./_schemas";
import { z } from "zod";

export const getN8ns = authFilterQuery(async (user, search) => {
  return await prisma.n8nWorkflow.findMany({
    where: {
      organizationId: user.organizationId,
    },
    select: {
      id: true,
      name: true,
      workflowId: true,
      description: true,
    },
  });
});

export type N8nsProps = NonNullable<Awaited<ReturnType<typeof getN8ns>>>;

export const createN8n = authedProcedure
  .createServerAction()
  .input(createN8nSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.n8nWorkflow.create({
        data: {
          name: input.n8nWorkflow.name,
          workflowId: input.n8nWorkflow.id,
          organization: { connect: { id: user.organizationId } },
          description: input.description,
        },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/n8ns`, "page");

    return { message: `Created N8n` };
  });

export const deleteN8n = authedProcedure
  .createServerAction()
  .input(deleteSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      await prisma.n8nWorkflow.delete({
        where: { id: input.id, organizationId: user.organizationId },
      });
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }

    revalidatePath(`/(app)/n8ns`, "page");

    return { message: `Deleted n8n` };
  });

export const getN8nsAction = authedProcedure
  .createServerAction()
  .input(z.object({ search: z.string().optional() }))
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      const url = new URL(`${process.env.N8N_API_URL}/workflows`);
      url.searchParams.append("active", "true");
      if (input.search) {
        url.searchParams.append("name", input.search);
      }
      url.searchParams.append("limit", "100");

      const response = await fetch(url.toString(), {
        headers: {
          "X-N8N-API-KEY": process.env.N8N_API_KEY as string,
        },
      });
      const n8ns = await response.json();

      const workflows = n8ns.data.map((workflow: any) => ({
        id: workflow.id,
        name: workflow.name,
      }));

      return {
        n8ns: workflows,
        message: "loaded n8n workflows",
      };
    } catch (error) {
      throw new Error(`There was an error, please try again: ${error.message}`);
    }
  });
