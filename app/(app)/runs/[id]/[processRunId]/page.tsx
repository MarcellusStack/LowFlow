import { notFound } from "next/navigation";
import { SurveyRun } from "./_components/survey-run";
import { getProcessRun } from "./_actions";

export default async function Page({
  params,
}: {
  params: { processRunId: string };
}) {
  const { processRunId } = params;

  const processRun = await getProcessRun({ processRunId });

  if (!processRun) {
    notFound();
  }
  return (
    <>
      <SurveyRun
        processRunId={processRun.id}
        data={(processRun.submission && processRun.submission.data) || {}}
        json={processRun.process.fields}
      />
    </>
  );
}
