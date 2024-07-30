import { QuickSearchAdd } from "@components/quick-search-add";
import { CreateRunForm } from "./_components/create-run-form";
import { Runs } from "./_components/runs";
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
      <QuickSearchAdd title="Create Run" content={<CreateRunForm />} />
      <Suspense fallback={<SuspenseLoader entity="Workflows" />}>
        <Runs searchParams={{ search: search }} />
      </Suspense>
    </>
  );
}
