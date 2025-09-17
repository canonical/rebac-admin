import { useEffect } from "react";

import { CapabilityMethodsItem } from "api/api.schemas";
import { useGetCapabilities } from "api/capabilities/capabilities";
import type { ErrorType } from "api-utils/mutator/custom-instance";
import type { Endpoint } from "types/api";
import { logger } from "utils";

export enum CapabilityAction {
  READ = CapabilityMethodsItem.GET,
  CREATE = CapabilityMethodsItem.POST,
  DELETE = CapabilityMethodsItem.DELETE,
  UPDATE = CapabilityMethodsItem.PUT,
  RELATE = CapabilityMethodsItem.PATCH,
}

type Result = {
  isFetching: boolean;
  isError: boolean;
  error: ErrorType<unknown> | null;
  refetch: ReturnType<typeof useGetCapabilities>["refetch"];
};

type GetCapabilitiesActionsResult = {
  actions: (string | undefined)[];
} & Result;

type CheckCapabilityResult = {
  hasCapability: boolean;
} & Result;

export const useGetCapabilityActions = (
  endpoint: Endpoint,
): GetCapabilitiesActionsResult => {
  const { data, isFetching, isError, error, refetch } = useGetCapabilities(
    // Capabilities should persist for the entire user session.
    { query: { gcTime: Infinity, staleTime: Infinity } },
  );

  useEffect(() => {
    if (error) {
      logger.error("Unable to fetch capabilities.", error);
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
  action: CapabilityAction | CapabilityAction[],
  allRequired = true,
): CheckCapabilityResult => {
  const { actions, isFetching, isError, error, refetch } =
    useGetCapabilityActions(endpoint);
  const actionArray = Array.isArray(action) ? action : [action];
  return {
    hasCapability: actionArray[allRequired ? "every" : "some"]((actionName) =>
      actions.includes(actionName),
    ),
    isFetching,
    isError,
    error,
    refetch,
  };
};
