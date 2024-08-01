import { Grid, GridCol, Stack, Title, Text } from "@mantine/core";
import { Process } from "./_components/process";
import { notFound } from "next/navigation";
import { getWorkflowRun } from "./_actions";
import { ProcessStatusBadge } from "@components/process-status-badge";

export default async function Layout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { id } = params;

  const workflowRun = await getWorkflowRun({ id });

  if (!workflowRun) {
    notFound();
  }

  return (
    <Grid gutter="sm" flex={1}>
      <GridCol span={{ base: 12, xs: 6, sm: 6, md: 6, lg: 8, xl: 8 }}>
        <ProcessStatusBadge status={workflowRun.status} />
        <Title order={2}>{workflowRun.workflow.name}</Title>
        <Text c="dimmed">{workflowRun.workflow.description}</Text>
        {children}
      </GridCol>
      <GridCol span={{ base: 12, xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
        <Stack gap="xs">
          {workflowRun.processRuns.map((process) => (
            <Process
              key={process.id}
              process={process.status}
              title={process.process.name}
              description={process.process.description}
              href={`/runs/${workflowRun.id}/${process.id}`}
              id={process.id}
            />
          ))}
        </Stack>
      </GridCol>
    </Grid>
  );
}
