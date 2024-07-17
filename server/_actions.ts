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
