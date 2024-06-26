import { Form, Formik } from "formik";
import * as Yup from "yup";

import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import PanelTableForm from "components/PanelTableForm";

import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  roleName: Yup.string().required("Required"),
});

const COLUMN_DATA = [
  {
    Header: "Role name",
    accessor: "roleName",
  },
];

const RolesPanelForm = ({
  error,
  existingRoles,
  addRoles,
  setAddRoles,
  removeRoles,
  setRemoveRoles,
}: Props) => {
  return (
    <PanelTableForm
      addEntities={addRoles}
      columns={COLUMN_DATA}
      entityEqual={(roleA, roleB) => roleA === roleB}
      entityMatches={(role, search) => role.includes(search)}
      entityName="role"
      error={error}
      existingEntities={existingRoles}
      form={
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
            <h5>Add roles</h5>
            <div className="panel-table-form__fields">
              <CleanFormikField
                label={Label.ROLE}
                name="roleName"
                type="text"
              />
              <div className="panel-table-form__submit">
                <FormikSubmitButton>{Label.SUBMIT}</FormikSubmitButton>
              </div>
            </div>
          </Form>
        </Formik>
      }
      generateCells={(roleName) => ({ roleName })}
      removeEntities={removeRoles}
      setAddEntities={setAddRoles}
      setRemoveEntities={setRemoveRoles}
    />
  );
};

export default RolesPanelForm;
