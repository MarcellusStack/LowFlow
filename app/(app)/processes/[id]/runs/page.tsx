import { notFound } from "next/navigation";

import { RunDataTable } from "../../../runs/_components/run-data-table";
import { getProcessRuns } from "./_actions";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const process = await getProcessRuns({ id });

  if (!process) {
    notFound();
  }

  return (
    <>
      <RunDataTable
        id={process.id}
        fields={process.fields}
        data={process.processRuns.map((run) => run.submission.data || {})}
      />
    </>
  );
}
