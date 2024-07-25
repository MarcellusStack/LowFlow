import { DangerProcess } from "./_components/danger-process";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return <DangerProcess id={id} />;
}
