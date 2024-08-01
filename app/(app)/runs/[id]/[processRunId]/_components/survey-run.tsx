"use client";

import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { Box, LoadingOverlay } from "@mantine/core";
import { completeRun, updateRun } from "../_actions";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { modals } from "@mantine/modals";
import { ButtonAction } from "@components/button-action";

export const SurveyRun = ({
  processRunId,
  data,
  json,
}: {
  processRunId: string;
  data: Object;
  json: Object;
}) => {
  const model = new Model(json);
  const { isPending, execute } = useEnhancedAction({
    action: updateRun,
  });

  model.data = data;

  const handleSave = () => {
    console.log("Form data saved:", model.data);
  };

  model.addNavigationItem({
    title: "Complete",
    action: () => {
      modals.open({
        title: "Complete Process",
        children: (
          <>
            <ButtonAction
              color="green"
              fullWidth
              hideModals={true}
              action={completeRun}
              values={{ processRunId }}
            >
              Complete
            </ButtonAction>
          </>
        ),
      });
    },
  });

  model.completeText = "Save";

  model.onCompleting.add((sender, options) => {
    options.allowComplete = false;
    handleSave();
    execute({ data: model.data, processRunId: processRunId });
  });

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          color="black"
          loaderProps={{ color: "black" }}
          visible={isPending}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 0 }}
        />
        <Survey model={model} />
      </Box>
    </>
  );
};
