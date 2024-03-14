import { CapabilityMethodsItem } from "api/api.schemas";
import { useGetCapabilities } from "api/capabilities/capabilities";

export type CapabilityActionItem =
  (typeof CapabilityActionItem)[keyof typeof CapabilityActionItem];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CapabilityActionItem = {
  LIST: "list",
  ADD: "add",
  DELETE: "delete",
  UPDATE: "update",
} as const;

export const CapabilityActionToMethod: Readonly<
  Record<CapabilityActionItem, CapabilityMethodsItem>
> = {
  [CapabilityActionItem.LIST]: CapabilityMethodsItem.GET,
  [CapabilityActionItem.ADD]: CapabilityMethodsItem.POST,
  [CapabilityActionItem.DELETE]: CapabilityMethodsItem.DELETE,
  [CapabilityActionItem.UPDATE]: CapabilityMethodsItem.PATCH,
};

const CapabilityMethodToAction: Readonly<
  Record<CapabilityMethodsItem, CapabilityActionItem>
> = {
  [CapabilityMethodsItem.GET]: CapabilityActionItem.LIST,
  [CapabilityMethodsItem.POST]: CapabilityActionItem.ADD,
  [CapabilityMethodsItem.DELETE]: CapabilityActionItem.DELETE,
  [CapabilityMethodsItem.PATCH]: CapabilityActionItem.UPDATE,
};

export const useGetCapabilityActions = (endpoint: string) => {
  const { data, isFetching, isSuccess } = useGetCapabilities();
  return {
    actions:
      data?.data.data
        .find((capability) => capability.endpoint === endpoint)
        ?.methods.map((method) => CapabilityMethodToAction[method]) ?? [],
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
