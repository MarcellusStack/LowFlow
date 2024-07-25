import { QuickSearchAdd } from "@components/quick-search-add";
import { Suspense } from "react";
import { WorkflowProcesses } from "./_components/workflow-processes";
import { SuspenseLoader } from "@components/suspense-loader";
import { WorkflowProcessForm } from "./_components/workflow-process-form";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { search?: string };
}) {
  const { id } = params;
  const { search } = searchParams;

  return (
    <>
      <QuickSearchAdd
        title="Create Process"
        content={<WorkflowProcessForm workflowId={id} />}
      />
      <Suspense fallback={<SuspenseLoader entity="Processes" />}>
        <WorkflowProcesses searchParams={{ id: id, search: search }} />
      </Suspense>
    </>
  );
}
