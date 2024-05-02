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
import NoEntityCard from "components/NoEntityCard";

import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  user: Yup.string().required("Required"),
});

const COLUMN_DATA: Column[] = [
  {
    Header: "Username",
    accessor: "username",
  },
  {
    Header: "Actions",
    accessor: "actions",
  },
];

type RowData = {
  username: ReactNode;
  actions: ReactNode;
};

const parseUser = (user: string): string => user.replace(/^user:/, "");

const IdentitiesPanelForm = ({
  error,
  existingIdentities,
  addIdentities,
  setAddIdentities,
  removeIdentities,
  setRemoveIdentities,
}: Props) => {
  const tableData = useMemo(() => {
    const add = addIdentities.map((user) => ({
      username: user,
      actions: (
        <Button
          appearance="base"
          hasIcon
          onClick={() => {
            setAddIdentities(
              addIdentities.filter((addUser) => addUser !== user),
            );
          }}
        >
          <Icon name="delete" aria-label={Label.REMOVE} />
        </Button>
      ),
    }));
    const existing =
      existingIdentities?.reduce<RowData[]>((filtered, id) => {
        const user = parseUser(id);
        if (user && !removeIdentities.find((removed) => user === removed)) {
          filtered.push({
            username: user,
            actions: (
              <Button
                appearance="base"
                hasIcon
                onClick={() => {
                  setRemoveIdentities([...removeIdentities, user]);
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
    addIdentities,
    existingIdentities,
    removeIdentities,
    setAddIdentities,
    setRemoveIdentities,
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
          <Formik<{ user: string }>
            initialValues={{ user: "" }}
            onSubmit={({ user }, helpers) => {
              setAddIdentities([...addIdentities, user]);
              helpers.resetForm();
              document
                .querySelector<HTMLInputElement>("input[name='username']")
                ?.focus();
            }}
            validationSchema={schema}
          >
            <Form aria-label={Label.FORM}>
              <fieldset>
                <h5>Add users</h5>
                <div className="entitlements-panel-form__fields">
                  <FormikField label={Label.USER} name="user" type="text" />
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
              message="Add users using the form above."
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default IdentitiesPanelForm;
