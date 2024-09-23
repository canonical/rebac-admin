import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import type { AxiosError } from "axios";
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
  onGroupUpdate,
  group,
  groupId,
  setPanelWidth,
}: Props) => {
  const queryClient = useQueryClient();
  const {
    error: getGroupsItemEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExistingEntitlements,
    queryKey: entitlementsQueryKey,
  } = useGetGroupsItemEntitlements(groupId);
  const {
    mutateAsync: patchGroupsItemEntitlements,
    isPending: isPatchGroupsItemEntitlementsPending,
  } = usePatchGroupsItemEntitlements();
  const {
    error: getGroupsItemIdentitiesError,
    data: existingIdentities,
    isFetching: isFetchingExistingIdentities,
    queryKey: identitiesQueryKey,
  } = useGetGroupsItemIdentities(groupId);
  const {
    mutateAsync: patchGroupsItemIdentities,
    isPending: isPatchGroupsItemIdentitiesPending,
  } = usePatchGroupsItemIdentities();
  const {
    error: getGroupsItemRolesError,
    data: existingRoles,
    isFetching: isFetchingExistingRoles,
    queryKey: rolesQueryKey,
  } = useGetGroupsItemRoles(groupId);
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
      isFetchingExistingEntitlements={isFetchingExistingEntitlements}
      isFetchingExistingIdentities={isFetchingExistingIdentities}
      isFetchingExistingRoles={isFetchingExistingRoles}
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
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
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
          queue.push(async (done) => {
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
            done();
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
          queue.push(async (done) => {
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
            done();
          });
        }
        if (addRoles.length || removeRoles?.length) {
          queue.push(async (done) => {
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
            done();
          });
        }
        if (groupChanged) {
          queue.push(async (done) => {
            try {
              await putGroupsItem({
                id: groupId,
                data: { ...group, ...values },
              });
              onGroupUpdate();
            } catch (error) {
              errors.push(Label.GROUP_ERROR);
            }
            done();
          });
        }
        queue.onDone(() => {
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
