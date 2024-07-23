import { QuickSearchAdd } from "@components/quick-search-add";
import { CreateWorkflowForm } from "./_components/create-workflow-form";
import { Workflows } from "./_components/workflows";
import { Suspense } from "react";
import { SuspenseLoader } from "@components/suspense-loader";

export default async function Page({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const { search } = searchParams;

  return (
    <>
      <QuickSearchAdd
        title="Create Workflow"
        content={<CreateWorkflowForm />}
      />
      <Suspense fallback={<SuspenseLoader entity="Workflows" />}>
        <Workflows searchParams={{ search: search }} />
      </Suspense>
    </>
  );
}
