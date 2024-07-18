import { auth } from "@server/auth";
import { ZSAError } from "zsa";
import { CachedUserProps, getCachedUser } from "./get-cached-user";

type SearchType =
  | string
  | Array<{ [key: string]: any }>
  | { [key: string]: any };

type AuthFilterQueryFunction<T> = (
  user: CachedUserProps,
  search: SearchType | undefined
) => Promise<T | null>;

/**
 * Higher-order function to wrap a query function with authentication.
 * @param queryFunction - The query function to be wrapped.
 * @returns A function that takes an optional search parameter and returns the result of the query function.
 */
export const authFilterQuery =
  <T>(queryFunction: AuthFilterQueryFunction<T>) =>
  async (search?: SearchType): Promise<T | null> => {
    const session = await auth();

    if (!session) {
      throw new ZSAError(
        "NOT_AUTHORIZED",
        "You are not authorized to perform this query. Please log in and try again."
      );
    }

    const user = await getCachedUser(session.user?.id as string);

    return queryFunction(user, search);
  };
