"use server";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getUser } from "@server/utils/get-user";

export const getCachedUser = cache(async (id: string) => {
  return await unstable_cache(
    async (id) => {
      return await getUser(id);
    },
    [id],
    {
      tags: ["user", id],
      revalidate: 60,
    }
  )(id);
});

export type CachedUserProps = NonNullable<
  Awaited<ReturnType<typeof getCachedUser>>
>;
