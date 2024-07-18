"use server";
import prisma from "@server/db";

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      organization: {
        select: { id: true, name: true },
      },
    },
  });

  return {
    id: user?.id || null,
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
    organizationName: user?.organization?.name || null,
    organizationId: user?.organization?.id || null,
  };
};

export type UserProps = NonNullable<Awaited<ReturnType<typeof getUser>>>;
