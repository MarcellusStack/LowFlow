import { notFound } from "next/navigation";
import { getWorkflow } from "./_actions";
import { WorkflowLayout } from "./_components/workflow-layout";

export default async function Layout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { id } = params;

  const workflow = await getWorkflow({ id });

  if (!workflow) {
    notFound();
  }
  return <WorkflowLayout workflow={workflow}>{children}</WorkflowLayout>;
}
