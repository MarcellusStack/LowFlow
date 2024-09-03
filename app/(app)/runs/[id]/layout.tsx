import { Grid, GridCol, Stack, Title, Text, Alert, Flex } from "@mantine/core";
import { Process } from "./_components/process";
import { notFound } from "next/navigation";
import { archiveRun, completeRun, getWorkflowRun, resetRun } from "./_actions";
import { ProcessStatusBadge } from "@components/process-status-badge";
import { ButtonModal } from "@components/button-modal";
import { ButtonAction } from "@components/button-action";

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
        {workflowRun.status === "completed" && (
          <Alert variant="light" color="green" title="Success">
            Workflow completed
          </Alert>
        )}

        {workflowRun.status === "archived" && (
          <Alert variant="light" color="gray" title="Archived">
            Workflow archived
          </Alert>
        )}

        {workflowRun.status !== "completed" &&
          workflowRun.status !== "archived" && <>{children}</>}
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
          <Flex gap="xs">
            {workflowRun.status === "ongoing" && (
              <ButtonModal
                content={
                  <ButtonAction
                    color="green"
                    hideModals={true}
                    action={completeRun}
                    values={{ workflowRunId: id }}
                  >
                    Complete
                  </ButtonAction>
                }
                color="green"
              >
                Complete
              </ButtonModal>
            )}
            {workflowRun.status === "completed" && (
              <ButtonModal
                color="yellow"
                content={
                  <ButtonAction
                    color="yellow"
                    hideModals={true}
                    action={resetRun}
                    values={{ workflowRunId: id }}
                  >
                    Reset
                  </ButtonAction>
                }
              >
                Reset
              </ButtonModal>
            )}
            <ButtonModal
              color="gray"
              content={
                <ButtonAction
                  color="gray"
                  hideModals={true}
                  action={archiveRun}
                  values={{ workflowRunId: id }}
                >
                  Archive
                </ButtonAction>
              }
            >
              Archive
            </ButtonModal>
          </Flex>
        </Stack>
      </GridCol>
    </Grid>
  );
}
