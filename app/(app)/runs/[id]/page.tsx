import { ProcessStatusBadge } from "@components/process-status-badge";
import { getWorkflowRun } from "./_actions";
import { notFound } from "next/navigation";
import { Title, Text } from "@mantine/core";
import { EmptyState } from "@components/empty-state";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const workflowRun = await getWorkflowRun({ id });

  if (!workflowRun) {
    notFound();
  }
  return <></>;
}
