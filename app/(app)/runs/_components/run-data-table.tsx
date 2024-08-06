"use client";

import { useState, useEffect } from "react";
import "tabulator-tables/dist/css/tabulator.min.css";
import "survey-analytics/survey.analytics.tabulator.min.css";
import { Model } from "survey-core";
import { Tabulator } from "survey-analytics/survey.analytics.tabulator";

export type RunDataTableProps = {
  fields: any;
  data: any;
  id: string;
};

export const RunDataTable = ({ fields, data, id }: RunDataTableProps) => {
  const [survey, setSurvey] = useState(null);
  const [surveyDataTable, setSurveyDataTable] = useState(null);
  const [surveyResults, setSurveyResults] = useState(null);

  if (!survey) {
    const survey = new Model(fields);
    setSurvey(survey);
  }
  if (!surveyResults) {
    setSurveyResults(data);
  }

  if (!surveyDataTable && !!survey) {
    const surveyDataTable = new Tabulator(survey, surveyResults);

    setSurveyDataTable(surveyDataTable);
  }

  useEffect(() => {
    surveyDataTable.render(`surveyDataTable-${id}`);

    // Hide the element with the class "sa-commercial"
    const commercialElement = document.querySelector(".sa-commercial");
    if (commercialElement) {
      commercialElement.style.display = "none";
    }

    return () => {
      const element = document.getElementById(`surveyDataTable-${id}`);
      if (element) {
        element.innerHTML = "";
      }
    };
  }, [surveyDataTable, id]);

  return <div id={`surveyDataTable-${id}`} />;
};
