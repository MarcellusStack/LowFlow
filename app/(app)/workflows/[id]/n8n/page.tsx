import { N8nWorkflows } from "../../../processes/[id]/n8n/_components/n8n-workflows-table";
import {
  connectN8nArchiveWorkflow,
  connectN8nCompleteWorkflow,
  connectN8nOngoingWorkflow,
  disconnectN8nArchiveWorkflow,
  disconnectN8nCompleteWorkflow,
  disconnectN8nOngoingWorkflow,
  getWorkflowN8ns,
} from "./_actions";


export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const n8ns = (await getWorkflowN8ns({ id })) || [];

  return (
    <>
      <N8nWorkflows
        id={id}
        title="Complete"
        n8ns={n8ns.n8nCompleteWorkflows || []}
        createAction={connectN8nCompleteWorkflow}
        deleteAction={disconnectN8nCompleteWorkflow}
      />

      <N8nWorkflows
        id={id}
        title="Ongoing"
        n8ns={n8ns.n8nCompleteWorkflows || []}
        createAction={connectN8nOngoingWorkflow}
        deleteAction={disconnectN8nOngoingWorkflow}
      />

      <N8nWorkflows
        id={id}
        title="Archive"
        n8ns={n8ns.n8nArchiveWorkflows || []}
        createAction={connectN8nArchiveWorkflow}
        deleteAction={disconnectN8nArchiveWorkflow}
      />
    </>
  );
}
