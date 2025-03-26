import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import PQueue from "p-queue";
import reactHotToast from "react-hot-toast";

import type {
  GroupEntitlementsPatchItem,
  GroupIdentitiesPatchItem,
  GroupRolesPatchItem,
  Response,
} from "api/api.schemas";
import {
  GroupEntitlementsPatchItemAllOfOp,
  GroupIdentitiesPatchItemOp,
  GroupRolesPatchItemOp,
} from "api/api.schemas";
import {
  useGetGroupsItemEntitlements,
  useGetGroupsItemIdentities,
  useGetGroupsItemRoles,
  usePatchGroupsItemEntitlements,
  usePatchGroupsItemIdentities,
  usePatchGroupsItemRoles,
  usePutGroupsItem,
} from "api/groups/groups";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { CapabilityAction, useCheckCapability } from "hooks/capabilities";
import { Endpoint } from "types/api";
import { getIds } from "utils/getIds";

import GroupPanel from "../GroupPanel";

import { Label } from "./types";
import type { Props } from "./types";

const generateError = (
  getGroupsItemEntitlementsError: AxiosError<Response> | null,
  getGroupsItemIdentitiesError: AxiosError<Response> | null,
  getGroupsItemRolesError: AxiosError<Response> | null,
) => {
  if (getGroupsItemEntitlementsError) {
    return `Unable to get entitlements: ${getGroupsItemEntitlementsError.response?.data.message}`;
  }
  if (getGroupsItemIdentitiesError) {
    return `Unable to get identities: ${getGroupsItemIdentitiesError.response?.data.message}`;
  }
  if (getGroupsItemRolesError) {
    return `Unable to get roles: ${getGroupsItemRolesError.response?.data.message}`;
  }
  return null;
};

const EditGroupPanel = ({
  close,
  onGroupUpdated,
  group,
  groupId,
  setPanelWidth,
}: Props) => {
  const queryClient = useQueryClient();
  const {
    hasCapability: canRelateUsers,
    isFetching: isFetchingIdentityCapability,
  } = useCheckCapability(Endpoint.GROUP_IDENTITIES, CapabilityAction.RELATE);
  const {
    hasCapability: canRelateRoles,
    isFetching: isFetchingRoleCapability,
  } = useCheckCapability(Endpoint.GROUP_ROLES, CapabilityAction.RELATE);
  const {
    hasCapability: canRelateEntitlements,
    isFetching: isFetchingEntitlementCapability,
  } = useCheckCapability(Endpoint.GROUP_ENTITLEMENTS, CapabilityAction.RELATE);
  const {
    error: getGroupsItemEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExistingEntitlements,
    queryKey: entitlementsQueryKey,
  } = useGetGroupsItemEntitlements(groupId, undefined, {
    query: {
      enabled: canRelateEntitlements,
    },
  });
  const {
    mutateAsync: patchGroupsItemEntitlements,
    isPending: isPatchGroupsItemEntitlementsPending,
  } = usePatchGroupsItemEntitlements();
  const {
    error: getGroupsItemIdentitiesError,
    data: existingIdentities,
    isFetching: isFetchingExistingIdentities,
    queryKey: identitiesQueryKey,
  } = useGetGroupsItemIdentities(groupId, undefined, {
    query: {
      enabled: canRelateUsers,
    },
  });
  const {
    mutateAsync: patchGroupsItemIdentities,
    isPending: isPatchGroupsItemIdentitiesPending,
  } = usePatchGroupsItemIdentities();
  const {
    error: getGroupsItemRolesError,
    data: existingRoles,
    isFetching: isFetchingExistingRoles,
    queryKey: rolesQueryKey,
  } = useGetGroupsItemRoles(groupId, undefined, {
    query: {
      enabled: canRelateRoles,
    },
  });
  const {
    mutateAsync: patchGroupsItemRoles,
    isPending: isPatchGroupsItemRolesPending,
  } = usePatchGroupsItemRoles();
  const { mutateAsync: putGroupsItem, isPending: isPutGroupsItemPending } =
    usePutGroupsItem();
  return (
    <GroupPanel
      close={close}
      error={generateError(
        getGroupsItemEntitlementsError,
        getGroupsItemIdentitiesError,
        getGroupsItemRolesError,
      )}
      existingEntitlements={existingEntitlements?.data.data}
      existingIdentities={existingIdentities?.data.data}
      existingRoles={existingRoles?.data.data}
      isEditing
      isFetchingExistingEntitlements={
        isFetchingExistingEntitlements || isFetchingEntitlementCapability
      }
      isFetchingExistingIdentities={
        isFetchingExistingIdentities || isFetchingIdentityCapability
      }
      isFetchingExistingRoles={
        isFetchingExistingRoles || isFetchingRoleCapability
      }
      isSaving={
        isPatchGroupsItemEntitlementsPending ||
        isPatchGroupsItemIdentitiesPending ||
        isPatchGroupsItemRolesPending ||
        isPutGroupsItemPending
      }
      onSubmit={async (
        values,
        groupChanged,
        addEntitlements,
        addIdentities,
        addRoles,
        removeEntitlements,
        removeIdentities,
        removeRoles,
      ) => {
        const errors: string[] = [];
        const queue = new PQueue({ concurrency: API_CONCURRENCY });
        if (addEntitlements.length || removeEntitlements?.length) {
          let patches: GroupEntitlementsPatchItem[] = [];
          if (addEntitlements.length) {
            patches = patches.concat(
              addEntitlements.map((entitlement) => ({
                entitlement,
                op: GroupEntitlementsPatchItemAllOfOp.add,
              })),
            );
          }
          if (removeEntitlements?.length) {
            patches = patches.concat(
              removeEntitlements.map((entitlement) => ({
                entitlement,
                op: GroupEntitlementsPatchItemAllOfOp.remove,
              })),
            );
          }
          await queue.add(async () => {
            try {
              await patchGroupsItemEntitlements({
                id: groupId,
                data: {
                  patches,
                },
              });
              await queryClient.invalidateQueries({
                queryKey: entitlementsQueryKey,
              });
            } catch (error) {
              errors.push(Label.ENTITLEMENTS_ERROR);
            }
          });
        }
        if (addIdentities.length || removeIdentities?.length) {
          let patches: GroupIdentitiesPatchItem[] = [];
          if (addIdentities.length) {
            patches = patches.concat(
              getIds(addIdentities).map((id) => ({
                identity: id,
                op: GroupIdentitiesPatchItemOp.add,
              })),
            );
          }
          if (removeIdentities?.length) {
            patches = patches.concat(
              getIds(removeIdentities).map((id) => ({
                identity: id,
                op: GroupIdentitiesPatchItemOp.remove,
              })),
            );
          }
          await queue.add(async () => {
            try {
              await patchGroupsItemIdentities({
                id: groupId,
                data: {
                  patches,
                },
              });
              await queryClient.invalidateQueries({
                queryKey: identitiesQueryKey,
              });
            } catch (error) {
              errors.push(Label.IDENTITIES_ERROR);
            }
          });
        }
        if (addRoles.length || removeRoles?.length) {
          await queue.add(async () => {
            let patches: GroupRolesPatchItem[] = [];
            if (addRoles.length) {
              patches = patches.concat(
                getIds(addRoles).map((id) => ({
                  role: id,
                  op: GroupRolesPatchItemOp.add,
                })),
              );
            }
            if (removeRoles?.length) {
              patches = patches.concat(
                getIds(removeRoles).map((id) => ({
                  role: id,
                  op: GroupRolesPatchItemOp.remove,
                })),
              );
            }
            try {
              await patchGroupsItemRoles({
                id: groupId,
                data: {
                  patches,
                },
              });
              await queryClient.invalidateQueries({
                queryKey: rolesQueryKey,
              });
            } catch (error) {
              errors.push(Label.ROLES_ERROR);
            }
          });
        }
        if (groupChanged) {
          await queue.add(async () => {
            try {
              await putGroupsItem({
                id: groupId,
                data: { ...group, ...values },
              });
              onGroupUpdated();
            } catch (error) {
              errors.push(Label.GROUP_ERROR);
            }
          });
        }
        void queue.onIdle().then(() => {
          close();
          if (errors.length) {
            errors.forEach((error) => {
              reactHotToast.custom((t) => (
                <ToastCard toastInstance={t} type="negative">
                  {error}
                </ToastCard>
              ));
            });
          } else {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="positive">
                {`Group "${values.name}" was updated.`}
              </ToastCard>
            ));
          }
        });
      }}
      group={group}
      setPanelWidth={setPanelWidth}
    />
  );
};

export default EditGroupPanel;
