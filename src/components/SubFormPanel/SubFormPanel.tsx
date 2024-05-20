import { Col, Row, Spinner } from "@canonical/react-components";
import classNames from "classnames";
import type { FormikValues } from "formik";
import { useEffect, useState } from "react";

import EmbeddedPanel from "components/EmbeddedPanel";
import PanelForm from "components/PanelForm";
import type { PanelWidth } from "hooks/usePanel";

import PanelFormLink from "./PanelFormLink";
import PanelFormNavigation from "./PanelFormNavigation";
import { TestId, type Props } from "./types";

const SubFormPanel = <F extends FormikValues>({
  children,
  entity,
  isEditing,
  isFetching,
  panelWidth,
  setPanelWidth,
  subForms,
  ...props
}: Props<F>) => {
  const [view, setView] = useState<string | null>();
  const changeView = (view: string | null, panelWidth?: PanelWidth | null) => {
    setView(view);
    setPanelWidth(panelWidth);
  };

  useEffect(() => {
    // Set the width of the default form panel.
    setPanelWidth(panelWidth);
  }, [panelWidth, setPanelWidth]);

  return (
    <EmbeddedPanel
      title={
        <PanelFormNavigation
          defaultPanelWidth={panelWidth}
          isEditing={isEditing}
          panelEntity={entity}
          setView={changeView}
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
        {isFetching ? (
          <Row>
            <Col size={12}>
              <Spinner text={`Loading ${entity}`} />
            </Col>
          </Row>
        ) : (
          <PanelForm<F>
            {...props}
            submitLabel={isEditing ? `Update ${entity}` : `Create ${entity}`}
          >
            <Row>
              <Col size={12}>{children}</Col>
            </Row>
            <Row>
              <Col size={12}>
                {subForms.map(({ count, entity, icon, panelWidth }) => (
                  <PanelFormLink
                    entity={entity}
                    count={count}
                    icon={icon}
                    isEditing={isEditing}
                    key={entity}
                    onClick={() => changeView(entity, panelWidth)}
                  />
                ))}
              </Col>
            </Row>
          </PanelForm>
        )}
      </div>
    </EmbeddedPanel>
  );
};

export default SubFormPanel;
