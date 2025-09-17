import { Col, Panel, Row, Spinner } from "@canonical/react-components";
import classNames from "classnames";
import type { FormikValues } from "formik";
import { useEffect, useState } from "react";

import PanelForm from "components/PanelForm";
import { PanelWidth } from "hooks/usePanel";

import PanelFormLink from "./PanelFormLink";
import PanelFormNavigation from "./PanelFormNavigation";
import { TestId, type Props } from "./types";

const SubFormPanel = <F extends FormikValues>({
  children,
  entity,
  isEditing,
  isFetching,
  panelWidth = PanelWidth.MEDIUM,
  setPanelWidth,
  subForms,
  ...props
}: Props<F>): JSX.Element => {
  const [view, setView] = useState<string | null>();
  const changeView = (
    viewName: string | null,
    width?: PanelWidth | null,
  ): void => {
    setView(viewName);
    setPanelWidth(width);
  };

  useEffect(() => {
    // Set the width of the default form panel.
    setPanelWidth(panelWidth);
  }, [panelWidth, setPanelWidth]);

  return (
    <Panel
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
                {subForms.map(
                  ({
                    count,
                    entity: subformEntity,
                    icon,
                    panelWidth: subPanelWidth = panelWidth,
                  }) => (
                    <PanelFormLink
                      entity={subformEntity}
                      count={count}
                      icon={icon}
                      isEditing={isEditing}
                      key={subformEntity}
                      onClick={() => {
                        changeView(subformEntity, subPanelWidth);
                      }}
                    />
                  ),
                )}
              </Col>
            </Row>
          </PanelForm>
        )}
      </div>
    </Panel>
  );
};

export default SubFormPanel;
