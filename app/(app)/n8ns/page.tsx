import { QuickSearchAdd } from "@components/quick-search-add";
import { CreateN8nForm } from "./_components/create-n8n-form";

import { Suspense } from "react";
import { SuspenseLoader } from "@components/suspense-loader";
import { N8nsTable } from "./_components/n8ns-table";
import { getN8ns } from "./_actions";

export default async function Page() {
  const n8ns = await getN8ns();
  return (
    <>
      <QuickSearchAdd title="Create N8n" content={<CreateN8nForm />} />
      <N8nsTable n8ns={n8ns} />
    </>
  );
}
