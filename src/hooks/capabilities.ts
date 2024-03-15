import { CapabilityMethodsItem } from "api/api.schemas";
import { useGetCapabilities } from "api/capabilities/capabilities";

export enum CapabilityActionItem {
  LIST = CapabilityMethodsItem.GET,
  ADD = CapabilityMethodsItem.POST,
  DELETE = CapabilityMethodsItem.DELETE,
  UPDATE = CapabilityMethodsItem.PATCH,
}

export const useGetCapabilityActions = (endpoint: string) => {
  const { data, isFetching, isSuccess } = useGetCapabilities();
  return {
    actions:
      data?.data.data
        .find((capability) => capability.endpoint === endpoint)
        ?.methods.map((method) =>
          Object.values<string>(CapabilityActionItem).find(
            (action) => action === method,
          ),
        ) ?? [],
    isFetching,
    isSuccess,
  };
};

export const useCheckCapabilityAction = (
  endpoint: string,
  action: CapabilityActionItem,
) => {
  const { actions, isFetching, isSuccess } = useGetCapabilityActions(endpoint);
  return {
    isActionAllowed: actions?.includes(action) ?? false,
    isFetching,
    isSuccess,
  };
};

export const useCheckUsersCapabilityAction = (action: CapabilityActionItem) => {
  const { isActionAllowed, isFetching, isSuccess } = useCheckCapabilityAction(
    "/identities",
    action,
  );
  return {
    isActionAllowed,
    isFetching,
    isSuccess,
  };
};
