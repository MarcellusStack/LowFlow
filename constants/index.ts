import { ICreatorOptions } from "survey-creator-core";

export const zodRequiredError = "is required";

export const tableColumnProps = {
  resizable: true,
  toggleable: true,
  draggable: true,
};

export const defaultCreatorOptions: ICreatorOptions = {
  showLogicTab: true,
  showTranslationTab: true,
  showSaveButton: true,
  isAutoSave: false,
};
