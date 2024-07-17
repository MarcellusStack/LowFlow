import { ButtonLink } from "@components/button-link";
import { AuthLayout } from "@components/layouts/auth-layout";
import { SignInForm } from "@components/sign-in-form";
import { SignedIn } from "@components/signed-in";
import { SignedOut } from "@components/signed-out";
import { Stack, Text, Title } from "@mantine/core";

export default async function Home() {
  return (
    <AuthLayout>
      <Stack gap="sm">
        <Title order={1}>Login</Title>
        <SignedIn>
          <Text>Hey! You are already signed in.</Text>
          <ButtonLink color="black" href="/dashboard">
            Continue to Dashboard
          </ButtonLink>
        </SignedIn>
        <SignedOut>
          <Text>Welcome! Please select a provider to log in.</Text>
          <SignInForm />
        </SignedOut>
      </Stack>
    </AuthLayout>
  );
}
