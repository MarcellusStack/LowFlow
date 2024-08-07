import { ProcessStatusBadge } from "@components/process-status-badge";
import { archiveRun, completeRun, getWorkflowRun } from "./_actions";
import { notFound } from "next/navigation";
import { Title, Text } from "@mantine/core";
import { EmptyState } from "@components/empty-state";
import { ButtonModal } from "@components/button-modal";
import { ButtonAction } from "@components/button-action";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const workflowRun = await getWorkflowRun({ id });

  if (!workflowRun) {
    notFound();
  }
  return (
    <>
      
    </>
  );
}
