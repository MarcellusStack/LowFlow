"use server";

import { authedProcedure } from "@server/utils/procedures";

import { signOut } from "@server/auth";
import { z } from "zod";
import { redirect } from "next/navigation";

export const signOutAction = authedProcedure
  .createServerAction()
  .input(z.object({}))
  .handler(async () => {
    await signOut();
    redirect("/");
  });
