import { useEffect } from "react";

import { CapabilityMethodsItem } from "api/api.schemas";
import { useGetCapabilities } from "api/capabilities/capabilities";
import type { Endpoint } from "types/api";
import { logger } from "utils";

export enum Label {
  FETCHING_CAPABILITIES_ERROR = "Unable to fetch capabilities.",
}

export enum CapabilityAction {
  READ = CapabilityMethodsItem.GET,
  CREATE = CapabilityMethodsItem.POST,
  DELETE = CapabilityMethodsItem.DELETE,
  UPDATE = CapabilityMethodsItem.PATCH,
}

export const useGetCapabilityActions = (endpoint: Endpoint) => {
  const { data, isFetching, isError, error, refetch } = useGetCapabilities(
    // Capabilities should persist for the entire user session.
    { query: { gcTime: Infinity, staleTime: Infinity } },
  );

  useEffect(() => {
    if (error) {
      logger.error(Label.FETCHING_CAPABILITIES_ERROR, error);
    }
  }, [error]);

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
    isError,
    error,
    refetch,
  };
};

export const useCheckCapability = (
  endpoint: Endpoint,
  action: CapabilityAction,
) => {
  const { actions, isFetching, isError, error, refetch } =
    useGetCapabilityActions(endpoint);
  return {
    hasCapability: actions?.includes(action) ?? false,
    isFetching,
    isError,
    error,
    refetch,
  };
};
