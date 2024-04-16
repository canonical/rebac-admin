import { Button, Icon } from "@canonical/react-components";

import { generateTitle } from "../PanelFormLink/utils";

import { PanelFormNavigationTitleId } from "./consts";
import { type Props } from "./types";

import "./_panel-form-navigation.scss";

const PanelFormNavigation = ({
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
            <Button appearance="link" onClick={() => setView(null)}>
              <Icon name="chevron-left" /> {panelTitle}
            </Button>
          </li>
        ) : null}
        <li className="p-breadcrumbs__item">
          <span
            className="p-heading--4 panel-form-navigation__current-title"
            id={PanelFormNavigationTitleId}
          >
            {viewTitle ?? panelTitle}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default PanelFormNavigation;
