import Limiter from "async-limiter";
import type { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import type { Response } from "api/api.schemas";
import {
  GroupEntitlementsPatchItemAllOfOp,
  GroupIdentitiesPatchItemOp,
  GroupRolesPatchItemOp,
} from "api/api.schemas";
import {
  useGetGroupsItem,
  useGetGroupsItemEntitlements,
  useGetGroupsItemIdentities,
  useGetGroupsItemRoles,
  usePatchGroupsItemEntitlements,
  usePatchGroupsItemIdentities,
  usePatchGroupsItemRoles,
} from "api/groups/groups";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";

import GroupPanel from "../GroupPanel";

import { Label } from "./types";
import type { Props } from "./types";

const generateError = (
  getGroupsItemEntitlementsError: AxiosError<Response> | null,
  getGroupsItemIdentitiesError: AxiosError<Response> | null,
  getGroupsItemRolesError: AxiosError<Response> | null,
  getGroupsItemError: AxiosError<Response> | null,
  noGroup: boolean,
) => {
  if (getGroupsItemError) {
    return `Unable to get group: ${getGroupsItemError.response?.data.message}`;
  }
  if (noGroup) {
    return "Unable to get group";
  }
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

const EditGroupPanel = ({ close, groupId, setPanelWidth }: Props) => {
  const {
    error: getGroupsItemError,
    data: groupDetails,
    isFetching: isFetchingGroup,
    isFetched: isFetchedGroup,
  } = useGetGroupsItem(groupId);
  const {
    error: getGroupsItemEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExistingEntitlements,
  } = useGetGroupsItemEntitlements(groupId);
  const {
    mutateAsync: patchGroupsItemEntitlements,
    isPending: isPatchGroupsItemEntitlementsPending,
  } = usePatchGroupsItemEntitlements();
  const {
    mutateAsync: deleteGroupsItemEntitlements,
    isPending: isDeleteGroupsItemEntitlementsPending,
  } = usePatchGroupsItemEntitlements();
  const {
    error: getGroupsItemIdentitiesError,
    data: existingIdentities,
    isFetching: isFetchingExistingIdentities,
  } = useGetGroupsItemIdentities(groupId);
  const {
    mutateAsync: patchGroupsItemIdentities,
    isPending: isPatchGroupsItemIdentitiesPending,
  } = usePatchGroupsItemIdentities();
  const {
    mutateAsync: deleteGroupsItemIdentities,
    isPending: isDeleteGroupsItemIdentitiesPending,
  } = usePatchGroupsItemIdentities();
  const {
    error: getGroupsItemRolesError,
    data: existingRoles,
    isFetching: isFetchingExistingRoles,
  } = useGetGroupsItemRoles(groupId);
  const {
    mutateAsync: patchGroupsItemRoles,
    isPending: isPatchGroupsItemRolesPending,
  } = usePatchGroupsItemRoles();
  const {
    mutateAsync: deleteGroupsItemRoles,
    isPending: isDeleteGroupsItemRodeleteGroupsItemRolesPending,
  } = usePatchGroupsItemRoles();
  const group = groupDetails?.data.data.find(({ id }) => id === groupId);
  return (
    <GroupPanel
      close={close}
      error={generateError(
        getGroupsItemEntitlementsError,
        getGroupsItemIdentitiesError,
        getGroupsItemRolesError,
        getGroupsItemError,
        isFetchedGroup && !group,
      )}
      existingEntitlements={existingEntitlements?.data.data}
      existingIdentities={existingIdentities?.data.data}
      existingRoles={existingRoles?.data.data}
      isEditing
      isFetchingExistingEntitlements={isFetchingExistingEntitlements}
      isFetchingExistingIdentities={isFetchingExistingIdentities}
      isFetchingExistingRoles={isFetchingExistingRoles}
      isFetchingGroup={isFetchingGroup}
      isSaving={
        isDeleteGroupsItemEntitlementsPending ||
        isPatchGroupsItemEntitlementsPending ||
        isPatchGroupsItemIdentitiesPending ||
        isDeleteGroupsItemIdentitiesPending ||
        isPatchGroupsItemRolesPending ||
        isDeleteGroupsItemRodeleteGroupsItemRolesPending
      }
      onSubmit={async (
        _values,
        addEntitlements,
        addIdentities,
        addRoles,
        removeEntitlements,
        removeIdentities,
        removeRoles,
      ) => {
        let hasEntitlementsError = false;
        let hasIdentitiesError = false;
        let hasRolesError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        if (addEntitlements.length) {
          queue.push(async (done) => {
            try {
              await patchGroupsItemEntitlements({
                id: groupId,
                data: {
                  patches: addEntitlements.map((entitlement) => ({
                    entitlement,
                    op: GroupEntitlementsPatchItemAllOfOp.add,
                  })),
                },
              });
            } catch (error) {
              hasEntitlementsError = true;
            }
            done();
          });
        }
        if (removeEntitlements?.length) {
          queue.push(async (done) => {
            try {
              await deleteGroupsItemEntitlements({
                id: groupId,
                data: {
                  patches: removeEntitlements.map((entitlement) => ({
                    entitlement,
                    op: GroupEntitlementsPatchItemAllOfOp.remove,
                  })),
                },
              });
            } catch (error) {
              hasEntitlementsError = true;
            }
            done();
          });
        }
        if (addIdentities.length) {
          queue.push(async (done) => {
            try {
              await patchGroupsItemIdentities({
                id: groupId,
                data: {
                  patches: addIdentities.map(({ email }) => ({
                    identity: email,
                    op: GroupIdentitiesPatchItemOp.add,
                  })),
                },
              });
            } catch (error) {
              hasIdentitiesError = true;
            }
            done();
          });
        }
        if (removeIdentities?.length) {
          queue.push(async (done) => {
            try {
              await deleteGroupsItemIdentities({
                id: groupId,
                data: {
                  patches: removeIdentities.map(({ email }) => ({
                    identity: email,
                    op: GroupIdentitiesPatchItemOp.remove,
                  })),
                },
              });
            } catch (error) {
              hasIdentitiesError = true;
            }
            done();
          });
        }
        if (addRoles.length) {
          queue.push(async (done) => {
            try {
              await patchGroupsItemRoles({
                id: groupId,
                data: {
                  patches: addRoles.map(({ name }) => ({
                    role: name,
                    op: GroupRolesPatchItemOp.add,
                  })),
                },
              });
            } catch (error) {
              hasRolesError = true;
            }
            done();
          });
        }
        if (removeRoles?.length) {
          queue.push(async (done) => {
            try {
              await deleteGroupsItemRoles({
                id: groupId,
                data: {
                  patches: removeRoles.map(({ name }) => ({
                    role: name,
                    op: GroupRolesPatchItemOp.remove,
                  })),
                },
              });
            } catch (error) {
              hasRolesError = true;
            }
            done();
          });
        }
        queue.onDone(() => {
          close();
          if (hasEntitlementsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.ENTITLEMENTS_ERROR}
              </ToastCard>
            ));
          }
          if (hasIdentitiesError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.IDENTITIES_ERROR}
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
          if (!hasIdentitiesError && !hasEntitlementsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="positive">
                {`Group "${group?.name}" was updated.`}
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
