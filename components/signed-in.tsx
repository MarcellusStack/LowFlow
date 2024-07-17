"use client";
import { Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
};
