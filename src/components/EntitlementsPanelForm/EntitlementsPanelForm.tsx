import { Form, Formik } from "formik";
import * as Yup from "yup";

import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import PanelTableForm from "components/PanelTableForm";

import type { Entitlement } from "./types";
import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  entity: Yup.string().required("Required"),
  resource: Yup.string().required("Required"),
  entitlement: Yup.string().required("Required"),
});

const COLUMN_DATA = [
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
];

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

const entitlementEqual = (
  entitlementA: Entitlement,
  entitlementB: Entitlement,
) =>
  !Object.keys(entitlementA).some((key) => {
    const entitlementKey = key as keyof Entitlement;
    return entitlementA[entitlementKey] !== entitlementB[entitlementKey];
  });

const entitlementMatches = (entitlement: Entitlement, search: string) =>
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
    <PanelTableForm<Entitlement>
      addEntities={addEntitlements}
      columns={COLUMN_DATA}
      entityEqual={entitlementEqual}
      entityMatches={entitlementMatches}
      entityName="entitlement"
      error={error}
      existingEntities={existingEntitlements?.reduce<Entitlement[]>(
        (entitlements, entitlement) => {
          const parsed = parseEntitlement(entitlement);
          if (parsed) {
            entitlements.push(parsed);
          }
          return entitlements;
        },
        [],
      )}
      form={
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
                relation to a specific resource. Select the appropriate resource
                and entitlement below and add it to the list of entitlements for
                this role.{" "}
              </p>
              <div className="panel-table-form__fields">
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
                <div className="panel-table-form__submit">
                  <FormikSubmitButton>{Label.SUBMIT}</FormikSubmitButton>
                </div>
              </div>
            </fieldset>
          </Form>
        </Formik>
      }
      generateCells={(entitlement) => entitlement}
      removeEntities={removeEntitlements}
      setAddEntities={setAddEntitlements}
      setRemoveEntities={setRemoveEntitlements}
    />
  );
};

export default EntitlementsPanelForm;
