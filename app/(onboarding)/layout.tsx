import { AuthLayout } from "@components/layouts/auth-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
