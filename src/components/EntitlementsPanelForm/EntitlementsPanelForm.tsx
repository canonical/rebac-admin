import { Form, Formik } from "formik";
import * as Yup from "yup";

import type { EntityEntitlement } from "api/api.schemas";
import { useGetEntitlements } from "api/entitlements/entitlements";
import PanelTableForm from "components/PanelTableForm";

import Fields from "./Fields";
import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  entity_id: Yup.string().required("Required"),
  entity_type: Yup.string().required("Required"),
  entitlement: Yup.string().required("Required"),
});

const COLUMN_DATA = [
  {
    Header: "Entity",
    accessor: "entity_type",
  },
  {
    Header: "Resource",
    accessor: "entity_id",
  },
  {
    Header: "Entitlement",
    accessor: "entitlement",
  },
];

const EntitlementsPanelForm = ({
  existingEntitlements,
  addEntitlements = [],
  setAddEntitlements,
  removeEntitlements = [],
  setRemoveEntitlements,
  submitProps,
}: Props) => {
  const {
    data: getEntitlementsData,
    isFetching: isGetEntitlementsFetching,
    error: getEntitlementsError,
  } = useGetEntitlements();

  return (
    <PanelTableForm<EntityEntitlement>
      addEntities={addEntitlements}
      columns={COLUMN_DATA}
      entityName="entitlement"
      error={getEntitlementsError?.message}
      existingEntities={existingEntitlements}
      isFetching={isGetEntitlementsFetching}
      form={
        <Formik<EntityEntitlement>
          initialValues={{
            entity_type: "",
            entitlement: "",
            entity_id: "",
          }}
          onSubmit={(values, helpers) => {
            setAddEntitlements([...addEntitlements, values]);
            helpers.resetForm();
            document
              .querySelector<HTMLInputElement>("input[name='entity_id']")
              ?.focus();
          }}
          validationSchema={schema}
        >
          <Form aria-label={Label.FORM}>
            <fieldset>
              <h5>{Label.ADD_ENTITLEMENT}</h5>
              <p className="p-text--small u-text--muted">
                In fine-grained authorisation entitlements need to be given in
                relation to a specific resource. Select the appropriate resource
                and entitlement below and add it to the list of entitlements for
                this role.{" "}
              </p>
              <Fields
                entitlements={getEntitlementsData?.data.data ?? []}
                submitProps={submitProps}
              />
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
