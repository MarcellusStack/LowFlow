import { AuthLayout } from "@components/layouts/auth-layout";
import { Button, Stack, Text, Title } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function Home() {
  return (
    <AuthLayout>
      <Stack gap="sm">
        <Title order={1}>Login</Title>
        <Text>Welcome! Please select a provider to log in.</Text>
        {process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "enable" && (
          <Button
            variant="light"
            leftSection={
              <IconBrandGoogle style={{ width: "70%", height: "70%" }} />
            }
            color="red"
          >
            Continue with Google
          </Button>
        )}
      </Stack>
    </AuthLayout>
  );
}
