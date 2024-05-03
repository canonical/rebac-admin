import {
  Col,
  Notification,
  NotificationSeverity,
  Row,
  ModularTable,
  Button,
  Icon,
} from "@canonical/react-components";
import { Form, Formik } from "formik";
import type { ReactNode } from "react";
import { useMemo } from "react";
import type { Column } from "react-table";
import * as Yup from "yup";

import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import NoEntityCard from "components/NoEntityCard";

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

type RowData = {
  entity: ReactNode;
  resource: ReactNode;
  entitlement: ReactNode;
  actions: ReactNode;
};

const parseEntitlement = (entitlement: string): Entitlement | null => {
  const parts = entitlement.match(/(^.+)::(.+):(.+)/);
  if (!parts) {
    return null;
  }
  return {
    entitlement: parts[1],
    entity: parts[2],
    resource: parts[3],
  };
};

const entitlementMatches = (
  entitlementA: Entitlement,
  entitlementB: Entitlement,
) =>
  !Object.keys(entitlementA).some((key) => {
    const entitlementKey = key as keyof Entitlement;
    return entitlementA[entitlementKey] !== entitlementB[entitlementKey];
  });

const EntitlementsPanelForm = ({
  error,
  existingEntitlements,
  addEntitlements,
  setAddEntitlements,
  removeEntitlements,
  setRemoveEntitlements,
}: Props) => {
  const tableData = useMemo(() => {
    const add = addEntitlements.map((entitlement) => ({
      ...entitlement,
      actions: (
        <Button
          appearance="base"
          hasIcon
          onClick={() => {
            setAddEntitlements(
              addEntitlements.filter((addEntitlement) =>
                entitlementMatches(addEntitlement, entitlement),
              ),
            );
          }}
        >
          <Icon name="delete" aria-label={Label.REMOVE} />
        </Button>
      ),
    }));
    const existing =
      existingEntitlements?.reduce<RowData[]>((filtered, id) => {
        const entitlement = parseEntitlement(id);
        if (
          entitlement &&
          !removeEntitlements.find((removed) =>
            entitlementMatches(entitlement, removed),
          )
        ) {
          filtered.push({
            ...entitlement,
            actions: (
              <Button
                appearance="base"
                hasIcon
                onClick={() => {
                  setRemoveEntitlements([...removeEntitlements, entitlement]);
                }}
              >
                <Icon name="delete" aria-label={Label.REMOVE} />
              </Button>
            ),
          });
        }
        return filtered;
      }, []) ?? [];

    return [...add, ...existing];
  }, [
    addEntitlements,
    existingEntitlements,
    removeEntitlements,
    setAddEntitlements,
    setRemoveEntitlements,
  ]);
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
                .querySelector<HTMLInputElement>("input[name='entity']")
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
                  <CleanFormikField
                    label={Label.ENTITY}
                    name="entity"
                    type="text"
                  />
                  <CleanFormikField
                    label={Label.RESOURCE}
                    name="resource"
                    type="text"
                  />
                  <CleanFormikField
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
          {tableData.length ? (
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
            />
          ) : (
            <NoEntityCard
              title={Label.EMPTY}
              message="Add entitlements using the form above."
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default EntitlementsPanelForm;
