import { DeleteWorkflowForm } from "../_components/delete-workflow-form";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return <DeleteWorkflowForm id={id} />;
}
