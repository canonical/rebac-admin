import { Form, Formik } from "formik";
import * as Yup from "yup";

import type { Role } from "api/api.schemas";
import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import PanelTableForm from "components/PanelTableForm";

import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  name: Yup.string().required("Required"),
});

const COLUMN_DATA = [
  {
    Header: "Role name",
    accessor: "name",
  },
];

const roleEqual = (roleA: Role, roleB: Role) =>
  !Object.keys(roleA).some((key) => {
    const roleKey = key as keyof Role;
    return roleA[roleKey] !== roleB[roleKey];
  });

const roleMatches = (role: Role, search: string) =>
  Object.values(role).some((value) => value.includes(search));

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
      entityEqual={roleEqual}
      entityMatches={roleMatches}
      entityName="role"
      error={error}
      existingEntities={existingRoles}
      form={
        <Formik<{ name: string }>
          initialValues={{ name: "" }}
          onSubmit={({ name }, helpers) => {
            setAddRoles([...addRoles, { name }]);
            helpers.resetForm();
            document
              .querySelector<HTMLInputElement>("input[name='name']")
              ?.focus();
          }}
          validationSchema={schema}
        >
          <Form aria-label={Label.FORM}>
            <h5>Add roles</h5>
            <div className="panel-table-form__fields">
              <CleanFormikField label={Label.ROLE} name="name" type="text" />
              <div className="panel-table-form__submit">
                <FormikSubmitButton>{Label.SUBMIT}</FormikSubmitButton>
              </div>
            </div>
          </Form>
        </Formik>
      }
      generateCells={({ name }) => ({ name })}
      removeEntities={removeRoles}
      setAddEntities={setAddRoles}
      setRemoveEntities={setRemoveRoles}
    />
  );
};

export default RolesPanelForm;
