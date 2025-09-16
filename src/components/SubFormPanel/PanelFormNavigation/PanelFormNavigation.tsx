import type { FC } from "react";

import BreadcrumbNavigation from "components/BreadcrumbNavigation";
import { SidePanelLabelledById } from "consts";

import { generateTitle } from "../PanelFormLink/utils";

import type { Props } from "./types";

const PanelFormNavigation: FC<Props> = ({
  defaultPanelWidth,
  isEditing,
  panelEntity,
  setView,
  view,
}: Props) => {
  const panelTitle = isEditing
    ? `Edit ${panelEntity}`
    : `Create ${panelEntity}`;
  const viewTitle = view ? generateTitle(view, isEditing) : null;
  return (
    <BreadcrumbNavigation
      backTitle={view ? panelTitle : null}
      onBack={() => setView(null, defaultPanelWidth)}
      title={viewTitle ?? panelTitle}
      titleId={SidePanelLabelledById}
    />
  );
};

export default PanelFormNavigation;
