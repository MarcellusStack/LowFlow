"use server";
import prisma from "@server/db";
import { authFilterQuery } from "@server/utils/query-clients";
import { cache } from "react";

export const getProcessRuns = cache(
  authFilterQuery(async (user, search) => {
    return await prisma.process.findFirst({
      where: {
        id: search.id,
        organizationId: user.organizationId,
      },
      select: {
        id: true,
        processRuns: {
          select: {
            submission: {
              select: {
                data: true,
              },
            },
          },
        },
        fields: true,
      },
    });
  })
);

export type ProcessRunsProps = NonNullable<
  Awaited<ReturnType<typeof getProcessRuns>>
>;
