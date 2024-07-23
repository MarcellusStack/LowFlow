import { DangerWorkflow } from "../_components/danger-workflow";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return <DangerWorkflow id={id} />;
}
