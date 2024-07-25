"use server";

import { revalidatePath } from "next/cache";
import prisma from "@server/db";
import { authedProcedure } from "@server/utils/procedures";
import { authFilterQuery } from "@server/utils/query-clients";
import { cache } from "react";
import { PresentationStatus } from "@prisma/client";
import { deleteSchema } from "@schemas/index";
import { updateProcessSchema } from "../_schemas";

export const getProcess = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.process.findUnique({
      where: {
        id: search.id,
        organizationId: user.organizationId,
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
      },
    });
  })
);

export type ProcessProps = NonNullable<Awaited<ReturnType<typeof getProcess>>>;

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

    revalidatePath(`/(app)/processes/${input.id}/general`, "page");

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
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }
    revalidatePath(`/(app)/processes/${input.id}/danger`, "page");
    return { message: `Deleted Process` };
  });
