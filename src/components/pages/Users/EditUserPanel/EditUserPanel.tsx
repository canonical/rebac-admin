import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import PQueue from "p-queue";
import type { FC } from "react";
import reactHotToast from "react-hot-toast";

import type {
  IdentityEntitlementsPatchItem,
  IdentityGroupsPatchItem,
  IdentityRolesPatchItem,
  Response,
} from "api/api.schemas";
import {
  IdentityEntitlementsPatchItemAllOfOp,
  IdentityGroupsPatchItemOp,
  IdentityRolesPatchItemOp,
} from "api/api.schemas";
import {
  useGetIdentitiesItemEntitlements,
  useGetIdentitiesItemGroups,
  useGetIdentitiesItemRoles,
  usePatchIdentitiesItemEntitlements,
  usePatchIdentitiesItemGroups,
  usePatchIdentitiesItemRoles,
  usePutIdentitiesItem,
} from "api/identities/identities";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { CapabilityAction, useCheckCapability } from "hooks/capabilities";
import { Endpoint } from "types/api";
import { getIds } from "utils/getIds";

import UserPanel from "../UserPanel";

import { Label } from "./types";
import type { Props } from "./types";

const generateError = (
  getIdentitiesItemGroupsError: AxiosError<Response> | null,
  getIdentitiesItemRolesError: AxiosError<Response> | null,
  getIdentitiesItemEntitlementsError: AxiosError<Response> | null,
): null | string => {
  if (getIdentitiesItemGroupsError) {
    return `Unable to get groups: ${getIdentitiesItemGroupsError.response?.data.message}`;
  }
  if (getIdentitiesItemRolesError) {
    return `Unable to get roles: ${getIdentitiesItemRolesError.response?.data.message}`;
  }
  if (getIdentitiesItemEntitlementsError) {
    return `Unable to get entitlements: ${getIdentitiesItemEntitlementsError.response?.data.message}`;
  }
  return null;
};

const EditUserPanel: FC<Props> = ({
  close,
  onUserUpdate,
  user,
  userId,
  setPanelWidth,
}: Props) => {
  const queryClient = useQueryClient();
  const {
    hasCapability: canRelateGroups,
    isFetching: isFetchingGroupCapability,
  } = useCheckCapability(Endpoint.IDENTITY_GROUPS, CapabilityAction.RELATE);
  const {
    hasCapability: canRelateRoles,
    isFetching: isFetchingRoleCapability,
  } = useCheckCapability(Endpoint.IDENTITY_ROLES, CapabilityAction.RELATE);
  const {
    hasCapability: canRelateEntitlements,
    isFetching: isFetchingEntitlementCapability,
  } = useCheckCapability(
    Endpoint.IDENTITY_ENTITLEMENTS,
    CapabilityAction.RELATE,
  );
  const {
    error: getIdentitiesItemGroupsError,
    data: existingGroups,
    isFetching: isFetchingExistingGroups,
    queryKey: groupsQueryKey,
  } = useGetIdentitiesItemGroups(userId, undefined, {
    query: {
      enabled: canRelateGroups,
    },
  });
  const {
    mutateAsync: patchIdentitiesItemGroups,
    isPending: isPatchIdentitiesItemGroupsPending,
  } = usePatchIdentitiesItemGroups();
  const {
    error: getIdentitiesItemRolesError,
    data: existingRoles,
    isFetching: isFetchingExistingRoles,
    queryKey: rolesQueryKey,
  } = useGetIdentitiesItemRoles(userId, undefined, {
    query: {
      enabled: canRelateRoles,
    },
  });
  const {
    mutateAsync: patchIdentitiesItemRoles,
    isPending: isPatchIdentitiesItemRolesPending,
  } = usePatchIdentitiesItemRoles();
  const {
    error: getIdentitiesItemEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExistingEntitlements,
    queryKey: entitlementsQueryKey,
  } = useGetIdentitiesItemEntitlements(userId, undefined, {
    query: {
      enabled: canRelateEntitlements,
    },
  });
  const {
    mutateAsync: patchIdentitiesItemEntitlements,
    isPending: isPatchIdentitiesItemEntitlementsPending,
  } = usePatchIdentitiesItemEntitlements();
  const {
    mutateAsync: putIdentitiesItem,
    isPending: isPutIdentitiesItemPending,
  } = usePutIdentitiesItem();
  return (
    <UserPanel
      close={close}
      error={generateError(
        getIdentitiesItemGroupsError,
        getIdentitiesItemRolesError,
        getIdentitiesItemEntitlementsError,
      )}
      existingGroups={existingGroups?.data.data}
      existingRoles={existingRoles?.data.data}
      existingEntitlements={existingEntitlements?.data.data}
      isEditing
      isFetchingExistingGroups={
        isFetchingExistingGroups || isFetchingGroupCapability
      }
      isFetchingExistingRoles={
        isFetchingExistingRoles || isFetchingRoleCapability
      }
      isFetchingExistingEntitlements={
        isFetchingExistingEntitlements || isFetchingEntitlementCapability
      }
      isSaving={
        isPatchIdentitiesItemGroupsPending ||
        isPatchIdentitiesItemRolesPending ||
        isPatchIdentitiesItemEntitlementsPending ||
        isPutIdentitiesItemPending
      }
      onSubmit={async (
        values,
        userChanged,
        addGroups,
        addRoles,
        addEntitlements,
        removeGroups,
        removeRoles,
        removeEntitlements,
      ) => {
        const errors: string[] = [];
        const queue = new PQueue({ concurrency: API_CONCURRENCY });
        if (addGroups.length || removeGroups?.length) {
          let patches: IdentityGroupsPatchItem[] = [];
          if (addGroups.length) {
            patches = patches.concat(
              getIds(addGroups).map((id) => ({
                group: id,
                op: IdentityGroupsPatchItemOp.add,
              })),
            );
          }
          if (removeGroups?.length) {
            patches = patches.concat(
              getIds(removeGroups).map((id) => ({
                group: id,
                op: IdentityGroupsPatchItemOp.remove,
              })),
            );
          }
          await queue.add(async () => {
            try {
              await patchIdentitiesItemGroups({
                id: userId,
                data: {
                  patches,
                },
              });
              await queryClient.invalidateQueries({
                queryKey: groupsQueryKey,
              });
            } catch (error) {
              errors.push(Label.GROUPS_ERROR);
            }
          });
        }
        if (addRoles.length || removeRoles?.length) {
          let patches: IdentityRolesPatchItem[] = [];
          if (addRoles.length) {
            patches = patches.concat(
              getIds(addRoles).map((id) => ({
                role: id,
                op: IdentityRolesPatchItemOp.add,
              })),
            );
          }
          if (removeRoles?.length) {
            patches = patches.concat(
              getIds(removeRoles).map((id) => ({
                role: id,
                op: IdentityRolesPatchItemOp.remove,
              })),
            );
          }
          await queue.add(async () => {
            try {
              await patchIdentitiesItemRoles({
                id: userId,
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
        if (addEntitlements.length || removeEntitlements?.length) {
          let patches: IdentityEntitlementsPatchItem[] = [];
          if (addEntitlements.length) {
            patches = patches.concat(
              addEntitlements.map((entitlement) => ({
                entitlement,
                op: IdentityEntitlementsPatchItemAllOfOp.add,
              })),
            );
          }
          if (removeEntitlements?.length) {
            patches = patches.concat(
              removeEntitlements.map((entitlement) => ({
                entitlement,
                op: IdentityEntitlementsPatchItemAllOfOp.remove,
              })),
            );
          }
          await queue.add(async () => {
            try {
              await patchIdentitiesItemEntitlements({
                id: userId,
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
        if (userChanged) {
          const { email, firstName, lastName } = values;
          await queue.add(async () => {
            try {
              await putIdentitiesItem({
                id: userId,
                data: {
                  ...user,
                  email,
                  firstName: firstName || undefined,
                  lastName: lastName || undefined,
                },
              });
              onUserUpdate();
            } catch (error) {
              errors.push(Label.USER_ERROR);
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
                {`User with email "${values.email}" was updated.`}
              </ToastCard>
            ));
          }
        });
      }}
      user={user}
      setPanelWidth={setPanelWidth}
    />
  );
};

export default EditUserPanel;
