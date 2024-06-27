import { Form, Formik } from "formik";
import * as Yup from "yup";

import type { Identity } from "api/api.schemas";
import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import PanelTableForm from "components/PanelTableForm";

import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  email: Yup.string().required("Required"),
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
        <Formik<{ email: string }>
          initialValues={{ email: "" }}
          onSubmit={({ email }, helpers) => {
            setAddIdentities([
              ...addIdentities,
              // TODO: This user should be selected from a list of existing users:
              // https://warthogs.atlassian.net/browse/WD-12647
              { email, addedBy: "", source: "" },
            ]);
            helpers.resetForm();
            document
              .querySelector<HTMLInputElement>("input[name='email']")
              ?.focus();
          }}
          validationSchema={schema}
        >
          <Form aria-label={Label.FORM}>
            <h5>Add users</h5>
            <div className="panel-table-form__fields">
              <CleanFormikField label={Label.USER} name="email" type="text" />
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
