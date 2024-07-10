import { AuthLayout } from "@components/layouts/auth-layout";
import { Button, Stack, Text, Title } from "@mantine/core";
import { auth, signIn, signOut } from "@server/auth";
import { IconBrandGoogle } from "@tabler/icons-react";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <AuthLayout>
      <Stack gap="sm">
        <Title order={1}>Login</Title>
        <Text>Welcome! Please select a provider to log in.</Text>
        {process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "enable" && (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button type="submit">Signin with Google</button>
          </form>
        )}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Sign out</button>
        </form>
      </Stack>
    </AuthLayout>
  );
}

{
  /* <Button
            variant="light"
            leftSection={
              <IconBrandGoogle style={{ width: "70%", height: "70%" }} />
            }
            color="red"
          >
            Continue with Google
          </Button> */
}
