"use client";

import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

export const SurveyPreview = ({ json }: { json: Object }) => {
  const model = new Model(json);
  model.showCompleteButton = false;

  return <Survey model={model} />;
};
