import { notFound } from "next/navigation";
import { getWorkflow } from "./_actions";
import { GeneralWorkflowForm } from "./_components/general-workflow-form";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const workflow = await getWorkflow({ id });

  if (!workflow) {
    notFound();
  }
  return <GeneralWorkflowForm workflow={workflow} />;
}
