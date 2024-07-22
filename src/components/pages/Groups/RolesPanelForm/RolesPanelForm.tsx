import type { SelectProps } from "@canonical/react-components";
import { Select } from "@canonical/react-components";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import type { Role } from "api/api.schemas";
import { useGetRoles } from "api/roles/roles";
import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import PanelTableForm from "components/PanelTableForm";

import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  id: Yup.string().required("Required"),
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
  const { data } = useGetRoles();
  const roles = data?.data.data;
  let options: NonNullable<SelectProps["options"]> = [
    { value: "", label: "Select role" },
  ];
  options = options.concat(
    roles?.reduce<NonNullable<SelectProps["options"]>>(
      (options, { id, name }) => {
        if (id) {
          options.push({
            value: id,
            label: name,
          });
        }
        return options;
      },
      [],
    ) ?? [],
  );
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
        <Formik<{ id: string }>
          initialValues={{ id: "" }}
          onSubmit={({ id }, helpers) => {
            const role = roles?.find((role) => role.id === id);
            if (role) {
              setAddRoles([...addRoles, role]);
            }
            helpers.resetForm();
            document
              .querySelector<HTMLSelectElement>("input[name='id']")
              ?.focus();
          }}
          validationSchema={schema}
        >
          <Form aria-label={Label.FORM}>
            <h5>Add roles</h5>
            <div className="panel-table-form__fields">
              <CleanFormikField
                component={Select}
                label={Label.ROLE}
                name="id"
                options={options}
              />
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
