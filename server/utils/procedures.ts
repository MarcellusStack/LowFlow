import { auth } from "@server/auth";
import { createServerActionProcedure, ZSAError } from "zsa";

export const authedProcedure = createServerActionProcedure().handler(
  async () => {
    const session = await auth();

    if (!session) {
      throw new ZSAError(
        "NOT_AUTHORIZED",
        "You are not authorized to perform this action"
      );
    }

    return {
      user: session.user,
    };
  }
);
