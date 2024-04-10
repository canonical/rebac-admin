import {
  ActionButton,
  Button,
  Col,
  Notification,
  NotificationSeverity,
  Row,
} from "@canonical/react-components";
import type { FormikValues } from "formik";
import { Form, Formik } from "formik";

import { Label, type Props } from "./types";

const PanelForm = <F extends FormikValues>({
  children,
  close,
  entity,
  error,
  isEditing,
  isSaving,
  ...props
}: Props<F>) => {
  // This component does not use the Panel component as Vanilla requires a strict
  // element hierarchy that can't be achieved using the normal components in
  // conjunction with portals.
  return (
    <>
      <div className="p-panel__header">
        <h4 className="p-panel__title">
          {isEditing ? `Edit ${entity}` : `Create ${entity}`}
        </h4>
      </div>
      <div className="p-panel__content">
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
            <Row className="u-align--right">
              <Col size={12}>
                <hr />
              </Col>
              <Col size={12}>
                <Button appearance="base" onClick={close} type="button">
                  {Label.CANCEL}
                </Button>
                <ActionButton
                  appearance="positive"
                  loading={isSaving}
                  type="submit"
                >
                  {isEditing ? `Update ${entity}` : `Create ${entity}`}
                </ActionButton>
              </Col>
            </Row>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default PanelForm;
