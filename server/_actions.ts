"use server";

import { authedProcedure } from "@server/utils/procedures";
import { signIn, signOut } from "@server/auth";
import { z } from "zod";
import { redirect } from "next/navigation";
import { createServerAction } from "zsa";

export const signOutAction = authedProcedure
  .createServerAction()
  .input(z.object({}))
  .handler(async () => {
    await signOut();
    redirect("/");
  });

export const signInAction = createServerAction()
  .input(z.object({}))
  .handler(async () => {
    await signIn("google");
  });

export const getN8nsAction = authedProcedure
  .createServerAction()
  .input(z.object({ search: z.string().optional() }))
  .handler(async ({ input, ctx }) => {
    try {
      const { user } = ctx;

      const n8ns = await prisma?.n8nWorkflow.findMany({
        where: {
          organizationId: user.organizationId,
          ...(input.search ? { name: { contains: input.search } } : {}),
        },
        select: {
          id: true,
          name: true,
        },
        take: 25,
      });

      return {
        n8ns: n8ns,
        message: "loaded n8ns",
      };
    } catch (error) {
      throw new Error(`There was an error please try again ${error.message}`);
    }
  });
