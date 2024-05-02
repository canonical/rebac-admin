import {
  Button,
  Col,
  Notification,
  NotificationSeverity,
  Row,
} from "@canonical/react-components";
import type { FormikValues } from "formik";
import { Form, Formik } from "formik";

import FormikSubmitButton from "components/FormikSubmitButton";

import { Label, type Props } from "./types";

const PanelForm = <F extends FormikValues>({
  children,
  close,
  error,
  isSaving,
  submitEnabled,
  submitLabel,
  submitButtonAppearance = "positive",
  ...props
}: Props<F>) => {
  return (
    <>
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
          {children}
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
                appearance={submitButtonAppearance}
              >
                {submitLabel}
              </FormikSubmitButton>
            </Col>
          </Row>
        </Form>
      </Formik>
    </>
  );
};

export default PanelForm;
