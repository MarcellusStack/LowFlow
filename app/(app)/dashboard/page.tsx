import { UserButton } from "@components/user-button";
import { Title } from "@mantine/core";
import { signOut } from "@server/auth";

export default async function Page() {
  return (
    <>
      <Title order={1}>Dashboard</Title>
    </>
  );
}
