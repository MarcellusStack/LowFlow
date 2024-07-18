import { QuickSearchAdd } from "@components/quick-search-add";
import { getWorkflows } from "./_actions";
import { CreateWorkflowForm } from "./_components/create-workflow-form";
import { Workflows } from "./_components/workflows";

export default async function Page() {
  const workflows = (await getWorkflows()) ?? [];

  return (
    <>
      <QuickSearchAdd
        title="Create Workflow"
        content={<CreateWorkflowForm />}
      />
      <Workflows workflows={workflows} />
    </>
  );
}
