"use server";
import prisma from "@server/db";

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: id } });

  return {
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
  };
};
