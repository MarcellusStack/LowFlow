import { notFound } from "next/navigation";
import { getProcessN8ns } from "./_actions";
import { EntityMultiSelect } from "@components/entity-multi-select";
import { QuickSearchAdd } from "@components/quick-search-add";
import { CreateProcessN8nForm } from "./_components/create-process-n8n-form";
import { ProcessN8nsTable } from "./_components/process-n8ns-table";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const n8ns = (await getProcessN8ns({ id })) || [];

  return (
    <>
      <QuickSearchAdd
        title="Connect N8n"
        content={<CreateProcessN8nForm id={id} />}
      />

      <ProcessN8nsTable processId={id} n8ns={n8ns.n8nWorkflows || []} />
    </>
  );
}
