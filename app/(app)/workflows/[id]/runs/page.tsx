import { QuickSearchAdd } from "@components/quick-search-add";
import { Suspense } from "react";
import { WorkflowRuns } from "./_components/workflow-runs";
import { SuspenseLoader } from "@components/suspense-loader";
import { WorkflowRunForm } from "./_components/workflow-run-form";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <>
      <QuickSearchAdd
        title="Create Workflow Run"
        content={<WorkflowRunForm workflowId={id} />}
      />
      <Suspense fallback={<SuspenseLoader entity="Workflow Runs" />}>
        <WorkflowRuns searchParams={{ id: id }} />
      </Suspense>
    </>
  );
}
