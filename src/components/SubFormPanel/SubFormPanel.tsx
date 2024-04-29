import { Col, Row } from "@canonical/react-components";
import classNames from "classnames";
import type { FormikValues } from "formik";
import { useState } from "react";

import EmbeddedPanel from "components/EmbeddedPanel";
import PanelForm from "components/PanelForm";

import PanelFormLink from "./PanelFormLink";
import PanelFormNavigation from "./PanelFormNavigation";
import { TestId, type Props } from "./types";

const SubFormPanel = <F extends FormikValues>({
  children,
  entity,
  isEditing,
  subForms,
  ...props
}: Props<F>) => {
  const [view, setView] = useState<string | null>();
  return (
    <EmbeddedPanel
      title={
        <PanelFormNavigation
          isEditing={isEditing}
          panelEntity={entity}
          setView={setView}
          view={view}
        />
      }
    >
      {view ? subForms.find((subForm) => subForm.entity === view)?.view : null}
      <div
        className={classNames({
          // Hide the form when displaying a different view. This will retain
          // the form values when returning to the initial form.
          "u-hide": !!view,
        })}
        data-testid={TestId.DEFAULT_VIEW}
      >
        <PanelForm<F>
          {...props}
          submitLabel={isEditing ? `Update ${entity}` : `Create ${entity}`}
        >
          <Row>
            <Col size={12}>{children}</Col>
          </Row>
          <Row>
            <Col size={12}>
              {subForms.map(({ count, entity, icon }) => (
                <PanelFormLink
                  entity={entity}
                  count={count}
                  icon={icon}
                  isEditing={isEditing}
                  key={entity}
                  onClick={() => setView(entity)}
                />
              ))}
            </Col>
          </Row>
        </PanelForm>
      </div>
    </EmbeddedPanel>
  );
};

export default SubFormPanel;
