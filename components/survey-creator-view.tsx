"use client";

import { useEffect, useState } from "react";

import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";
import { defaultCreatorOptions } from "@constants/index";
import { Box } from "@mantine/core";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { updateProcessEditor } from "../app/(app)/processes/[id]/editor/_actions";
import { useServerActionMutation } from "@hooks/server-actions";

export const SurveyCreatorView = ({
  id,
  json,
}: {
  id: string;
  json?: Object;
}) => {
  let [creator, setCreator] = useState<SurveyCreator>();
  const { isPending, execute } = useEnhancedAction({
    action: updateProcessEditor,
  });

  /* const { mutate } = useServerActionMutation(updateProcessEditor, {}); */

  if (!creator) {
    creator = new SurveyCreator(defaultCreatorOptions);
    creator.saveSurveyFunc = () => {
      execute({
        id,
        fields: creator.JSON,
      });
      callback(no, true);
    };
    setCreator(creator);
  }

  creator.JSON = json;

  useEffect(() => {
    const spanElement = document.querySelector(
      ".svc-creator__non-commercial-text"
    );
    if (spanElement) {
      spanElement.style.display = "none";
    }
  }, []);

  return (
    <Box style={{ height: "calc(100vh - 250px)" }}>
      <SurveyCreatorComponent creator={creator} />
    </Box>
  );
};
