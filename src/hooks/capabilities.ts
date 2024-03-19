import { CapabilityMethodsItem } from "api/api.schemas";
import { useGetCapabilities } from "api/capabilities/capabilities";
import { Endpoint } from "types/api";
import { MAX_SIGNED_INT32 } from "types/utils";

export enum CapabilityAction {
  READ = CapabilityMethodsItem.GET,
  CREATE = CapabilityMethodsItem.POST,
  DELETE = CapabilityMethodsItem.DELETE,
  UPDATE = CapabilityMethodsItem.PATCH,
}

export const useGetCapabilityActions = (endpoint: Endpoint) => {
  const { data, isFetching, isRefetching, isError, error, refetch } =
    useGetCapabilities(
      // The maximal signed 32-bit number is the maximal allowed time, as
      // gcTime uses setTimeout, which only supports signed 32-bit numbers.
      { query: { gcTime: MAX_SIGNED_INT32 } },
    );
  return {
    actions:
      data?.data.data
        .find((capability) => capability.endpoint === endpoint)
        ?.methods.map((method) =>
          Object.values<string>(CapabilityAction).find(
            (action) => action === method,
          ),
        ) ?? [],
    isFetching,
    isRefetching,
    isError,
    error,
    refetch,
  };
};

export const useCheckCapability = (
  endpoint: Endpoint,
  action: CapabilityAction,
) => {
  const { actions, isFetching, isRefetching, isError, error, refetch } =
    useGetCapabilityActions(endpoint);
  return {
    isActionAllowed: actions?.includes(action) ?? false,
    isFetching,
    isRefetching,
    isError,
    error,
    refetch,
  };
};

export const useCheckUsersCapability = (action: CapabilityAction) => {
  const { isActionAllowed } = useCheckCapability(Endpoint.IDENTITIES, action);
  return isActionAllowed;
};
