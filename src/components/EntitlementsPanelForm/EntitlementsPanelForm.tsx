import { Form, Formik } from "formik";
import * as Yup from "yup";

import type { EntityEntitlement } from "api/api.schemas";
import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import PanelTableForm from "components/PanelTableForm";

import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  entity_name: Yup.string().required("Required"),
  entity_type: Yup.string().required("Required"),
  entitlement_type: Yup.string().required("Required"),
});

const COLUMN_DATA = [
  {
    Header: "Entity",
    accessor: "entity_name",
  },
  {
    Header: "Resource",
    accessor: "entity_type",
  },
  {
    Header: "Entitlement",
    accessor: "entitlement_type",
  },
];

const entitlementEqual = (
  entitlementA: EntityEntitlement,
  entitlementB: EntityEntitlement,
) =>
  !Object.keys(entitlementA).some((key) => {
    const entitlementKey = key as keyof EntityEntitlement;
    return entitlementA[entitlementKey] !== entitlementB[entitlementKey];
  });

const entitlementMatches = (entitlement: EntityEntitlement, search: string) =>
  Object.values(entitlement).some((value) => value.includes(search));

const EntitlementsPanelForm = ({
  error,
  existingEntitlements,
  addEntitlements,
  setAddEntitlements,
  removeEntitlements,
  setRemoveEntitlements,
}: Props) => {
  return (
    <PanelTableForm<EntityEntitlement>
      addEntities={addEntitlements}
      columns={COLUMN_DATA}
      entityEqual={entitlementEqual}
      entityMatches={entitlementMatches}
      entityName="entitlement"
      error={error}
      existingEntities={existingEntitlements}
      form={
        <Formik<EntityEntitlement>
          initialValues={{
            entity_type: "",
            entitlement_type: "",
            entity_name: "",
          }}
          onSubmit={(values, helpers) => {
            setAddEntitlements([...addEntitlements, values]);
            helpers.resetForm();
            document
              .querySelector<HTMLInputElement>("input[name='entity_name']")
              ?.focus();
          }}
          validationSchema={schema}
        >
          <Form aria-label={Label.FORM}>
            <fieldset>
              <h5>Add entitlement tuple</h5>
              <p className="p-text--small u-text--muted">
                In fine-grained authorisation entitlements need to be given in
                relation to a specific resource. Select the appropriate resource
                and entitlement below and add it to the list of entitlements for
                this role.{" "}
              </p>
              <div className="panel-table-form__fields">
                <CleanFormikField
                  label={Label.ENTITY}
                  name="entity_name"
                  type="text"
                />
                <CleanFormikField
                  label={Label.RESOURCE}
                  name="entity_type"
                  type="text"
                />
                <CleanFormikField
                  label={Label.ENTITLEMENT}
                  name="entitlement_type"
                  type="text"
                />
                <div className="panel-table-form__submit">
                  <FormikSubmitButton>{Label.SUBMIT}</FormikSubmitButton>
                </div>
              </div>
            </fieldset>
          </Form>
        </Formik>
      }
      generateCells={(entitlement) => ({ ...entitlement })}
      removeEntities={removeEntitlements}
      setAddEntities={setAddEntitlements}
      setRemoveEntities={setRemoveEntitlements}
    />
  );
};

export default EntitlementsPanelForm;
