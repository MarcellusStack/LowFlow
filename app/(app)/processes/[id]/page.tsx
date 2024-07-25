import { notFound } from "next/navigation";
import { getProcess } from "./_actions";
import { GeneralProcessForm } from "./_components/general-process-form";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const process = await getProcess({ id });

  if (!process) {
    notFound();
  }
  return <GeneralProcessForm process={process} />;
}
