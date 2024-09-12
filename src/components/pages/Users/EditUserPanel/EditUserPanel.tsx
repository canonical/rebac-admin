import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import type { AxiosError } from "axios";
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
} from "api/identities/identities";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { getIds } from "utils/getIds";

import UserPanel from "../UserPanel";

import { Label } from "./types";
import type { Props } from "./types";

const generateError = (
  getIdentitiesItemGroupsError: AxiosError<Response> | null,
  getIdentitiesItemRolesError: AxiosError<Response> | null,
  getIdentitiesItemEntitlementsError: AxiosError<Response> | null,
) => {
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

const EditUserPanel = ({ close, user, userId, setPanelWidth }: Props) => {
  const queryClient = useQueryClient();
  const {
    error: getIdentitiesItemGroupsError,
    data: existingGroups,
    isFetching: isFetchingExistingGroups,
    queryKey: groupsQueryKey,
  } = useGetIdentitiesItemGroups(userId);
  const {
    mutateAsync: patchIdentitiesItemGroups,
    isPending: isPatchIdentitiesItemGroupsPending,
  } = usePatchIdentitiesItemGroups();
  const {
    error: getIdentitiesItemRolesError,
    data: existingRoles,
    isFetching: isFetchingExistingRoles,
    queryKey: rolesQueryKey,
  } = useGetIdentitiesItemRoles(userId);
  const {
    mutateAsync: patchIdentitiesItemRoles,
    isPending: isPatchIdentitiesItemRolesPending,
  } = usePatchIdentitiesItemRoles();
  const {
    error: getIdentitiesItemEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExistingEntitlements,
    queryKey: entitlementsQueryKey,
  } = useGetIdentitiesItemEntitlements(userId);
  const {
    mutateAsync: patchIdentitiesItemEntitlements,
    isPending: isPatchIdentitiesItemEntitlementsPending,
  } = usePatchIdentitiesItemEntitlements();
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
      isFetchingExistingGroups={isFetchingExistingGroups}
      isFetchingExistingRoles={isFetchingExistingRoles}
      isFetchingExistingEntitlements={isFetchingExistingEntitlements}
      isSaving={
        isPatchIdentitiesItemGroupsPending ||
        isPatchIdentitiesItemRolesPending ||
        isPatchIdentitiesItemEntitlementsPending
      }
      onSubmit={async (
        _values,
        addGroups,
        addRoles,
        addEntitlements,
        removeGroups,
        removeRoles,
        removeEntitlements,
      ) => {
        let hasGroupsError = false;
        let hasRolesError = false;
        let hasEntitlementsError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
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
          queue.push(async (done) => {
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
              hasGroupsError = true;
            }
            done();
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
          queue.push(async (done) => {
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
              hasRolesError = true;
            }
            done();
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
          queue.push(async (done) => {
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
              hasEntitlementsError = true;
            }
            done();
          });
        }
        queue.onDone(() => {
          close();
          if (hasGroupsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.GROUPS_ERROR}
              </ToastCard>
            ));
          }
          if (hasRolesError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.ROLES_ERROR}
              </ToastCard>
            ));
          }
          if (hasEntitlementsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.ENTITLEMENTS_ERROR}
              </ToastCard>
            ));
          }
          if (!hasGroupsError && !hasRolesError && !hasEntitlementsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="positive">
                {`User with email "${user.email}" was updated.`}
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
