import { Form, Formik } from "formik";
import * as Yup from "yup";

import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import PanelTableForm from "components/PanelTableForm";

import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  user: Yup.string().required("Required"),
});

const COLUMN_DATA = [
  {
    Header: "Username",
    accessor: "username",
  },
];

const parseUser = (user: string): string => user.replace(/^user:/, "");

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
      entityEqual={(identityA, identityB) => identityA === identityB}
      entityMatches={(identity, search) => identity.includes(search)}
      entityName="user"
      error={error}
      existingEntities={existingIdentities?.map((identity) =>
        parseUser(identity),
      )}
      form={
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
            <h5>Add users</h5>
            <div className="panel-table-form__fields">
              <CleanFormikField label={Label.USER} name="user" type="text" />
              <div className="panel-table-form__submit">
                <FormikSubmitButton>{Label.SUBMIT}</FormikSubmitButton>
              </div>
            </div>
          </Form>
        </Formik>
      }
      generateCells={(username) => ({ username })}
      removeEntities={removeIdentities}
      setAddEntities={setAddIdentities}
      setRemoveEntities={setRemoveIdentities}
    />
  );
};

export default IdentitiesPanelForm;
