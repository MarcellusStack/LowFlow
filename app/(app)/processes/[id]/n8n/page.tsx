import { N8nWorkflows } from "@components/n8n-workflows-table";
import {
  connectN8nCompletedProcessWorkflow,
  connectN8nOngoingProcessWorkflow,
  disconnectN8nCompletedProcessWorkflow,
  disconnectN8nOngoingProcessWorkflow,
  getProcessN8ns,
} from "./_actions";


export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const n8ns = (await getProcessN8ns({ id })) || [];

  return (
    <>
      <N8nWorkflows
        id={id}
        title="Complete"
        n8ns={n8ns.n8nCompleteWorkflows || []}
        createAction={connectN8nCompletedProcessWorkflow}
        deleteAction={disconnectN8nCompletedProcessWorkflow}
      />
      <N8nWorkflows
        id={id}
        title="Reset"
        n8ns={n8ns.n8nOngoingWorkflows || []}
        createAction={connectN8nOngoingProcessWorkflow}
        deleteAction={disconnectN8nOngoingProcessWorkflow}
      />
    </>
  );
}
