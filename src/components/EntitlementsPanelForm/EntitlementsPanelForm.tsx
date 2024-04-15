import {
  Col,
  Notification,
  NotificationSeverity,
  Row,
  FormikField,
  ModularTable,
  Button,
  Icon,
} from "@canonical/react-components";
import { Form, Formik } from "formik";
import { useMemo } from "react";
import type { Column } from "react-table";
import * as Yup from "yup";

import FormikSubmitButton from "components/FormikSubmitButton";

import type { Entitlement } from "./types";
import { Label, type Props } from "./types";

import "./_entitlements-panel-form.scss";

const schema = Yup.object().shape({
  entity: Yup.string().required("Required"),
  resource: Yup.string().required("Required"),
  entitlement: Yup.string().required("Required"),
});

const COLUMN_DATA: Column[] = [
  {
    Header: "Entity",
    accessor: "entity",
  },
  {
    Header: "Resource",
    accessor: "resource",
  },
  {
    Header: "Entitlement",
    accessor: "entitlement",
  },
  {
    Header: "Actions",
    accessor: "actions",
  },
];

const EntitlementsPanelForm = ({
  error,
  addEntitlements,
  setAddEntitlements,
}: Props) => {
  const tableData = useMemo(
    () =>
      addEntitlements.map((entitlement) => ({
        ...entitlement,
        actions: (
          <Button
            appearance="base"
            hasIcon
            onClick={() => {
              setAddEntitlements(
                addEntitlements.filter((addEntitlement) =>
                  Object.keys(addEntitlement).some((key) => {
                    const entitlementKey = key as keyof Entitlement;
                    return (
                      addEntitlement[entitlementKey] !==
                      entitlement[entitlementKey]
                    );
                  }),
                ),
              );
            }}
          >
            <Icon name="delete" aria-label={Label.REMOVE} />
          </Button>
        ),
      })),
    [addEntitlements, setAddEntitlements],
  );
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

      <Row>
        <Col size={12}>
          <Formik<Entitlement>
            initialValues={{ resource: "", entitlement: "", entity: "" }}
            onSubmit={(values, helpers) => {
              setAddEntitlements([...addEntitlements, values]);
              helpers.resetForm();
              document
                .querySelector<HTMLInputElement>("input[name='resource']")
                ?.focus();
            }}
            validationSchema={schema}
          >
            <Form aria-label={Label.FORM}>
              <fieldset>
                <h5>Add entitlement tuple</h5>
                <p className="p-text--small u-text--muted">
                  In fine-grained authorisation entitlements need to be given in
                  relation to a specific resource. Select the appropriate
                  resource and entitlement below and add it to the list of
                  entitlements for this role.{" "}
                </p>
                <div className="entitlements-panel-form__fields">
                  <FormikField label={Label.ENTITY} name="entity" type="text" />
                  <FormikField
                    label={Label.RESOURCE}
                    name="resource"
                    type="text"
                  />
                  <FormikField
                    label={Label.ENTITLEMENT}
                    name="entitlement"
                    type="text"
                  />
                  <div className="entitlements-panel-form__submit">
                    <FormikSubmitButton>{Label.SUBMIT}</FormikSubmitButton>
                  </div>
                </div>
              </fieldset>
            </Form>
          </Formik>
        </Col>
      </Row>
      <Row>
        <Col size={12}>
          <ModularTable
            getCellProps={({ column }) => {
              switch (column.id) {
                case "actions":
                  return {
                    className: "u-align--right",
                  };

                default:
                  return {};
              }
            }}
            getHeaderProps={({ id }) => {
              switch (id) {
                case "actions":
                  return {
                    className: "u-align--right",
                  };

                default:
                  return {};
              }
            }}
            columns={COLUMN_DATA}
            data={tableData}
            emptyMsg="No entitlements have been added."
          />
        </Col>
      </Row>
    </>
  );
};

export default EntitlementsPanelForm;
