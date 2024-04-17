import {
  Button,
  Col,
  Notification,
  NotificationSeverity,
  Row,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FormikValues } from "formik";
import { Form, Formik } from "formik";
import { useState } from "react";

import FormikSubmitButton from "components/FormikSubmitButton";

import PanelFormLink from "./PanelFormLink";
import PanelFormNavigation from "./PanelFormNavigation";
import { Label, TestId, type Props } from "./types";

const PanelForm = <F extends FormikValues>({
  submitEnabled,
  children,
  close,
  entity,
  error,
  isEditing,
  isSaving,
  subForms,
  ...props
}: Props<F>) => {
  const [view, setView] = useState<string | null>();
  // This component does not use the Panel component as Vanilla requires a strict
  // element hierarchy that can't be achieved using the normal components in
  // conjunction with portals.
  return (
    <>
      <div className="p-panel__header">
        <div className="p-panel__title">
          <PanelFormNavigation
            isEditing={isEditing}
            panelEntity={entity}
            setView={setView}
            view={view}
          />
        </div>
      </div>
      <div className="p-panel__content">
        {view
          ? subForms.find((subForm) => subForm.entity === view)?.view
          : null}
        <div
          className={classNames({
            // Hide the form when displaying a different view. This will retain
            // the form values when returning to the initial form.
            "u-hide": !!view,
          })}
          data-testid={TestId.DEFAULT_VIEW}
        >
          {error ? (
            <Row>
              <Col size={12}>
                <Notification severity={NotificationSeverity.NEGATIVE}>
                  {error}
                </Notification>
              </Col>
            </Row>
          ) : null}
          <Formik<F> {...props}>
            <Form>
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
              <Row className="u-align--right">
                <Col size={12}>
                  <hr />
                </Col>
                <Col size={12}>
                  <Button appearance="base" onClick={close} type="button">
                    {Label.CANCEL}
                  </Button>
                  <FormikSubmitButton
                    enabled={submitEnabled}
                    loading={isSaving}
                  >
                    {isEditing ? `Update ${entity}` : `Create ${entity}`}
                  </FormikSubmitButton>
                </Col>
              </Row>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default PanelForm;
