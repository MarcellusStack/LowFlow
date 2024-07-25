import { QuickSearchAdd } from "@components/quick-search-add";
import { Suspense } from "react";
import { SuspenseLoader } from "@components/suspense-loader";
import { notFound } from "next/navigation";
import { SurveyCreatorView } from "@components/survey-creator-view";
import { getProcessEditor } from "./_actions";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const process = await getProcessEditor({ id });

  if (!process) {
    notFound();
  }

  return (
    <>
      <SurveyCreatorView id={process.id} json={process.fields} />
    </>
  );
}
