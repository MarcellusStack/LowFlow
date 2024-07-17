"use client";
import { Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    return <>{children}</>;
  }

  return null;
};
