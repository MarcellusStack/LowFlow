import { notFound } from "next/navigation";
import { getWorkflowN8ns } from "./_actions";
import { QuickSearchAdd } from "@components/quick-search-add";
import { CreateWorkflowN8nForm } from "./_components/create-workflow-n8n-form";
import { WorkflowN8nsTable } from "./_components/workflow-n8ns-table";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const n8ns = (await getWorkflowN8ns({ id })) || [];

  return (
    <>
      <QuickSearchAdd
        title="Connect N8n"
        content={<CreateWorkflowN8nForm id={id} />}
      />

      <WorkflowN8nsTable processId={id} n8ns={n8ns.n8nWorkflows || []} />
    </>
  );
}
