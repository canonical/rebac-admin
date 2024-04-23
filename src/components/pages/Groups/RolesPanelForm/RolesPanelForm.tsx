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
import type { ReactNode } from "react";
import { useMemo } from "react";
import type { Column } from "react-table";
import * as Yup from "yup";

import FormikSubmitButton from "components/FormikSubmitButton";

import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  roleName: Yup.string().required("Required"),
});

const COLUMN_DATA: Column[] = [
  {
    Header: "Role name",
    accessor: "roleName",
  },
  {
    Header: "Actions",
    accessor: "actions",
  },
];

type RowData = {
  roleName: ReactNode;
  actions: ReactNode;
};

const RolesPanelForm = ({
  error,
  existingRoles,
  addRoles,
  setAddRoles,
  removeRoles,
  setRemoveRoles,
}: Props) => {
  const tableData = useMemo(() => {
    const add = addRoles.map((role) => ({
      roleName: role,
      actions: (
        <Button
          appearance="base"
          hasIcon
          onClick={() => {
            setAddRoles(addRoles.filter((addRole) => addRole !== role));
          }}
        >
          <Icon name="delete" aria-label={Label.REMOVE} />
        </Button>
      ),
    }));
    const existing =
      existingRoles?.reduce<RowData[]>((filtered, role) => {
        if (role && !removeRoles.find((removed) => role === removed)) {
          filtered.push({
            roleName: role,
            actions: (
              <Button
                appearance="base"
                hasIcon
                onClick={() => {
                  setRemoveRoles([...removeRoles, role]);
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
  }, [addRoles, existingRoles, removeRoles, setAddRoles, setRemoveRoles]);
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
          <Formik<{ roleName: string }>
            initialValues={{ roleName: "" }}
            onSubmit={({ roleName }, helpers) => {
              setAddRoles([...addRoles, roleName]);
              helpers.resetForm();
              document
                .querySelector<HTMLInputElement>("input[name='roleName']")
                ?.focus();
            }}
            validationSchema={schema}
          >
            <Form aria-label={Label.FORM}>
              <fieldset>
                <h5>Add roles</h5>
                <div className="entitlements-panel-form__fields">
                  <FormikField label={Label.ROLE} name="roleName" type="text" />
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
            emptyMsg="No roles have been added."
          />
        </Col>
      </Row>
    </>
  );
};

export default RolesPanelForm;
