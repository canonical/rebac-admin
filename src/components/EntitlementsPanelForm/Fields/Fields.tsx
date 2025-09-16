import { Select } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import type { FC, OptionHTMLAttributes } from "react";

import type { EntitlementSchema, EntityEntitlement } from "api/api.schemas";
import { useGetResources } from "api/resources/resources";
import CleanFormikField from "components/CleanFormikField";
import type { FormikSubmitButtonProps } from "components/FormikSubmitButton";
import FormikSubmitButton from "components/FormikSubmitButton";
import { Endpoint } from "types/api";

import { EntitlementsPanelFormLabel } from "..";

import { Label } from "./types";

type Props = {
  entitlements: EntitlementSchema[];
  submitProps?: Partial<FormikSubmitButtonProps>;
};

const Fields: FC<Props> = ({ entitlements, submitProps }: Props) => {
  const queryClient = useQueryClient();
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<EntityEntitlement>();
  // TODO: implement pagination for resources.
  const { data: getResourcesData, isFetching: isGetResourcesFetching } =
    useGetResources(
      { entityType: values.entity_type },
      { query: { enabled: !!values.entity_type } },
    );
  const resources = getResourcesData?.data.data ?? [];
  const entityIdOptions: OptionHTMLAttributes<HTMLOptionElement>[] = [
    {
      disabled: true,
      label: isGetResourcesFetching
        ? Label.LOADING_RESOURCES
        : Label.SELECT_RESOURCE,
      value: "",
    },
  ];
  entityIdOptions.push(
    ...resources.map((resource) => ({
      disabled: false,
      label: resource.entity.name,
      value: resource.entity.id,
    })),
  );

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
          void setFieldValue("entity_id", "");
          void setFieldTouched("entity_id", false);
          void setFieldValue("entitlement", "");
          void setFieldTouched("entitlement", false);
          void queryClient.invalidateQueries({
            queryKey: [Endpoint.RESOURCES],
          });
        }}
      />
      <CleanFormikField
        component={Select}
        label={EntitlementsPanelFormLabel.RESOURCE}
        name="entity_id"
        disabled={!values.entity_type}
        options={entityIdOptions}
      />
      <CleanFormikField
        component={Select}
        label={EntitlementsPanelFormLabel.ENTITLEMENT}
        name="entitlement"
        disabled={!values.entity_type || !values.entity_id}
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
                .map((entitlement) => entitlement.entitlement),
            ),
          ].map((entitlement) => ({
            disabled: false,
            label: entitlement,
            value: entitlement,
          })),
        )}
      />
      <div className="panel-table-form__submit">
        <FormikSubmitButton {...submitProps}>
          {EntitlementsPanelFormLabel.SUBMIT}
        </FormikSubmitButton>
      </div>
    </div>
  );
};

export default Fields;
