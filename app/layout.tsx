import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "@utils/theme";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { SessionProvider } from "next-auth/react";
import { auth } from "@server/auth";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <ModalsProvider>
            <SessionProvider refetchInterval={30} session={session}>
              {children}
            </SessionProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
