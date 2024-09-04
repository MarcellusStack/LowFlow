import { getWorkflowN8ns } from "./_actions";
import { N8nArchivedWorkflowsTable } from "./_components/n8n-archived-workflows-table";
import { N8nCompleteWorkflowsTable } from "./_components/n8n-complete-workflows-table";
import { N8nOngoingWorkflowsTable } from "./_components/n8n-ongoing-workflows-table";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const n8ns = (await getWorkflowN8ns({ id })) || [];

  return (
    <>
      <N8nCompleteWorkflowsTable
        workflowId={id}
        n8ns={n8ns.n8nCompleteWorkflows || []}
      />

      <N8nOngoingWorkflowsTable
        workflowId={id}
        n8ns={n8ns.n8nOngoingWorkflows || []}
      />

      <N8nArchivedWorkflowsTable
        workflowId={id}
        n8ns={n8ns.n8nArchiveWorkflows || []}
      />
    </>
  );
}
