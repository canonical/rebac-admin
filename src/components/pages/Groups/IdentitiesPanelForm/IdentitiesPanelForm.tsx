import type { SelectProps } from "@canonical/react-components";
import { Select } from "@canonical/react-components";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import type { Identity } from "api/api.schemas";
import { useGetIdentities } from "api/identities/identities";
import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import PanelTableForm from "components/PanelTableForm";

import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  id: Yup.string().required("Required"),
});

const COLUMN_DATA = [
  {
    Header: "Email",
    accessor: "email",
  },
];

const identityEqual = (identityA: Identity, identityB: Identity) =>
  !Object.keys(identityA).some((key) => {
    const identityKey = key as keyof Identity;
    return identityA[identityKey] !== identityB[identityKey];
  });

const identityMatches = (identity: Identity, search: string) =>
  Object.values(identity).some((value) => value.includes(search));

const IdentitiesPanelForm = ({
  error,
  existingIdentities,
  addIdentities,
  setAddIdentities,
  removeIdentities,
  setRemoveIdentities,
}: Props) => {
  const { data } = useGetIdentities();
  const users = data?.data.data;
  let options: NonNullable<SelectProps["options"]> = [
    { value: "", label: "Select user" },
  ];
  options = options.concat(
    users?.reduce<NonNullable<SelectProps["options"]>>(
      (options, { id, email }) => {
        if (id) {
          options.push({
            value: id,
            label: email,
          });
        }
        return options;
      },
      [],
    ) ?? [],
  );
  return (
    <PanelTableForm
      addEntities={addIdentities}
      columns={COLUMN_DATA}
      entityEqual={identityEqual}
      entityMatches={identityMatches}
      entityName="user"
      error={error}
      existingEntities={existingIdentities}
      form={
        <Formik<{ id: string }>
          initialValues={{ id: "" }}
          onSubmit={({ id }, helpers) => {
            const user = users?.find((user) => user.id === id);
            if (user) {
              setAddIdentities([...addIdentities, user]);
            }
            helpers.resetForm();
            document
              .querySelector<HTMLInputElement>("input[name='id']")
              ?.focus();
          }}
          validationSchema={schema}
        >
          <Form aria-label={Label.FORM}>
            <h5>Add users</h5>
            <div className="panel-table-form__fields">
              <CleanFormikField
                component={Select}
                label={Label.USER}
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
      generateCells={({ email }) => ({ email })}
      removeEntities={removeIdentities}
      setAddEntities={setAddIdentities}
      setRemoveEntities={setRemoveIdentities}
    />
  );
};

export default IdentitiesPanelForm;
