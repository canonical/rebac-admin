import { Button, Icon } from "@canonical/react-components";

import { EmbeddedPanelLabelledById } from "components/EmbeddedPanel/consts";

import { generateTitle } from "../PanelFormLink/utils";

import { type Props } from "./types";

import "./_panel-form-navigation.scss";

const PanelFormNavigation = ({
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
    <nav className="p-breadcrumbs panel-form-navigation">
      <ol className="p-breadcrumbs__items">
        {view ? (
          <li className="p-breadcrumbs__item">
            <Button
              className="u-no-margin--bottom"
              appearance="link"
              onClick={() => setView(null, defaultPanelWidth)}
            >
              <Icon name="chevron-left" /> {panelTitle}
            </Button>
          </li>
        ) : null}
        <li className="p-breadcrumbs__item">
          <span
            className="p-heading--4 panel-form-navigation__current-title"
            id={EmbeddedPanelLabelledById}
          >
            {viewTitle ?? panelTitle}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default PanelFormNavigation;
