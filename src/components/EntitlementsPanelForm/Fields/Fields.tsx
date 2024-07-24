import { Select } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import { useFormikContext } from "formik";

import type { EntityEntitlement } from "api/api.schemas";
import { useGetResources } from "api/resources/resources";
import CleanFormikField from "components/CleanFormikField";
import FormikSubmitButton from "components/FormikSubmitButton";
import { Endpoint } from "types/api";

import { EntitlementsPanelFormLabel } from "..";

import { Label } from "./types";

type Props = {
  entitlements: EntityEntitlement[];
};

const Fields = ({ entitlements }: Props) => {
  const queryClient = useQueryClient();
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<EntityEntitlement>();
  const { data: getResourcesData, isFetching: isGetResourcesFetching } =
    useGetResources(
      { entityType: values.entity_type },
      { query: { enabled: !!values.entity_type } },
    );
  const resources = getResourcesData?.data.data || [];

  return (
    <div className="panel-table-form__fields">
      <CleanFormikField
        component={Select}
        label={EntitlementsPanelFormLabel.ENTITY}
        name="entity_type"
        options={[
          {
            disabled: true,
            label: "Select a resource type",
            value: "",
          },
        ].concat(
          [
            ...new Set(
              entitlements.map((entitlement) => entitlement.entity_type),
            ),
          ].map((entityType) => ({
            disabled: false,
            label: entityType,
            value: entityType,
          })),
        )}
        onChange={(event) => {
          void setFieldValue("entity_type", event.target.value);
          void setFieldValue("entity_name", "");
          void setFieldTouched("entity_name", false);
          void setFieldValue("entitlement_type", "");
          void setFieldTouched("entitlement_type", false);
          void queryClient.invalidateQueries({
            queryKey: [Endpoint.RESOURCES],
          });
        }}
      />
      <CleanFormikField
        component={Select}
        label={EntitlementsPanelFormLabel.RESOURCE}
        name="entity_name"
        disabled={!values.entity_type}
        options={[
          {
            disabled: true,
            label: isGetResourcesFetching
              ? Label.LOADING_RESOURCES
              : (Label.SELECT_RESOURCE as string),
            value: "",
          },
        ].concat(
          resources.map((resource) => ({
            disabled: false,
            label: resource.name.concat(
              resource.entity.id.length > 5
                ? ` (${resource.entity.id.slice(0, 5)}...)`
                : ` (${resource.entity.id})`,
            ),
            value: resource.entity.id,
          })),
        )}
      />
      <CleanFormikField
        component={Select}
        label={EntitlementsPanelFormLabel.ENTITLEMENT}
        name="entitlement_type"
        disabled={!values.entity_type || !values.entity_name}
        options={[
          {
            disabled: true,
            label: "Select an entitlement",
            value: "",
          },
        ].concat(
          [
            ...new Set(
              entitlements
                .filter(
                  (entitlement) =>
                    entitlement.entity_type === values.entity_type,
                )
                .map((entitlement) => entitlement.entitlement_type),
            ),
          ].map((entitlementType) => ({
            disabled: false,
            label: entitlementType,
            value: entitlementType,
          })),
        )}
      />
      <div className="panel-table-form__submit">
        <FormikSubmitButton>
          {EntitlementsPanelFormLabel.SUBMIT}
        </FormikSubmitButton>
      </div>
    </div>
  );
};

export default Fields;
