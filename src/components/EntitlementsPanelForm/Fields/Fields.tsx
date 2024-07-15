import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { EntityEntitlement } from "api/api.schemas";
import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";

import { Label } from "../types";

type Props = {
  entitlements: EntityEntitlement[];
};

const Fields = ({ entitlements }: Props) => {
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<EntityEntitlement>();
  const entitlementsFilteredByEntityName = entitlements.filter(
    (value) => value.entity_name === values.entity_name,
  );

  return (
    <div className="panel-table-form__fields">
      <CleanFormikField
        component={Select}
        defaultValue=""
        label={Label.ENTITY}
        name="entity_name"
        options={[
          {
            disabled: true,
            label: "Select an option",
            value: "",
          },
        ].concat(
          entitlements.map((entitlement) => ({
            disabled: false,
            label: entitlement.entity_name,
            value: entitlement.entity_name,
          })),
        )}
        onChange={(event) => {
          void setFieldValue("entity_name", event.target.value);
          void setFieldValue("entity_type", "");
          void setFieldTouched("entity_type", false);
          void setFieldValue("entitlement_type", "");
          void setFieldTouched("entitlement_type", false);
        }}
      />
      <CleanFormikField
        component={Select}
        defaultValue=""
        label={Label.RESOURCE}
        name="entity_type"
        disabled={!values.entity_name}
        options={[
          {
            disabled: true,
            label: "Select an option",
            value: "",
          },
        ].concat(
          entitlementsFilteredByEntityName.map((entitlement) => ({
            disabled: false,
            label: entitlement.entity_type,
            value: entitlement.entity_type,
          })),
        )}
        onChange={(event) => {
          void setFieldValue("entity_type", event.target.value);
          void setFieldValue("entitlement_type", "");
          void setFieldTouched("entitlement_type", false);
        }}
      />
      <CleanFormikField
        component={Select}
        defaultValue=""
        label={Label.ENTITLEMENT}
        name="entitlement_type"
        disabled={!values.entity_name || !values.entity_type}
        options={[
          {
            disabled: true,
            label: "Select an option",
            value: "",
          },
        ].concat(
          entitlementsFilteredByEntityName
            .filter(
              (entitlement) => entitlement.entity_type === values.entity_type,
            )
            .map((entitlement) => ({
              disabled: false,
              label: entitlement.entitlement_type,
              value: entitlement.entitlement_type,
            })),
        )}
      />
      <div className="panel-table-form__submit">
        <FormikSubmitButton>{Label.SUBMIT}</FormikSubmitButton>
      </div>
    </div>
  );
};

export default Fields;
