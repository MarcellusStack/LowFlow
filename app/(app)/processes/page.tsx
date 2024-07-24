import { QuickSearchAdd } from "@components/quick-search-add";
import { ProcessForm } from "./_components/process-form";
import { Suspense } from "react";
import { SuspenseLoader } from "@components/suspense-loader";
import { Processes } from "./_components/processes";

export default async function Page({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const { search } = searchParams;

  return (
    <>
      <QuickSearchAdd title="Create Process" content={<ProcessForm />} />
      <Suspense fallback={<SuspenseLoader entity="Processes" />}>
        <Processes searchParams={{ search: search }} />
      </Suspense>
    </>
  );
}
