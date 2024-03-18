import { CapabilityMethodsItem } from "api/api.schemas";
import { useGetCapabilities } from "api/capabilities/capabilities";
import { Endpoint } from "types/api";

export enum CapabilityAction {
  READ = CapabilityMethodsItem.GET,
  CREATE = CapabilityMethodsItem.POST,
  DELETE = CapabilityMethodsItem.DELETE,
  UPDATE = CapabilityMethodsItem.PATCH,
}

const CAPABILITIES_CACHE_TIME = 30 * 60 * 1000;

export const useGetCapabilityActions = (endpoint: Endpoint) => {
  const { data, isFetching, isRefetching, isError, error } = useGetCapabilities(
    // Change caching time from default 5 minutes to 30 minutes.
    { query: { gcTime: CAPABILITIES_CACHE_TIME } },
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
  };
};

export const useCheckCapability = (
  endpoint: Endpoint,
  action: CapabilityAction,
) => {
  const { actions, isFetching, isRefetching, isError, error } =
    useGetCapabilityActions(endpoint);
  return {
    isActionAllowed: actions?.includes(action) ?? false,
    isFetching,
    isRefetching,
    isError,
    error,
  };
};

export const useCheckUsersCapability = (action: CapabilityAction) => {
  const { isActionAllowed } = useCheckCapability(Endpoint.IDENTITIES, action);
  return { isActionAllowed };
};
