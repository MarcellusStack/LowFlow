import { auth } from "@server/auth";
import { createServerActionProcedure, ZSAError } from "zsa";
import { getCachedUser } from "./get-cached-user";

export const authedProcedure = createServerActionProcedure().handler(
  async () => {
    const session = await auth();

    if (!session) {
      throw new ZSAError(
        "NOT_AUTHORIZED",
        "You are not authorized to perform this action"
      );
    }

    const user = await getCachedUser(session.user?.id as string);

    return {
      user: user,
    };
  }
);
