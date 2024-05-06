import Limiter from "async-limiter";
import type { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import type { Response } from "api/api.schemas";
import {
  useDeleteGroupsIdEntitlementsEntitlementId,
  useDeleteGroupsIdIdentitiesIdentityId,
  useDeleteGroupsIdRolesRolesId,
  useGetGroupsIdEntitlements,
  useGetGroupsIdIdentities,
  useGetGroupsIdRoles,
  usePatchGroupsIdEntitlements,
  usePatchGroupsIdIdentities,
  usePostGroupsIdRoles,
} from "api/groups-id/groups-id";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";

import GroupPanel from "../GroupPanel";

import { Label } from "./types";
import type { Props } from "./types";

const generateError = (
  getGroupsIdEntitlementsError: AxiosError<Response> | null,
  getGroupsIdIdentitiesError: AxiosError<Response> | null,
  getGroupsIdRolesError: AxiosError<Response> | null,
) => {
  if (getGroupsIdEntitlementsError) {
    return `Unable to get entitlements: ${getGroupsIdEntitlementsError.response?.data.message}`;
  }
  if (getGroupsIdIdentitiesError) {
    return `Unable to get identities: ${getGroupsIdIdentitiesError.response?.data.message}`;
  }
  if (getGroupsIdRolesError) {
    return `Unable to get roles: ${getGroupsIdRolesError.response?.data.message}`;
  }
  return null;
};

const EditGroupPanel = ({ close, groupId, setPanelWidth }: Props) => {
  const {
    error: getGroupsIdEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExistingEntitlements,
  } = useGetGroupsIdEntitlements(groupId);
  const {
    mutateAsync: patchGroupsIdEntitlements,
    isPending: isPatchGroupsIdEntitlementsPending,
  } = usePatchGroupsIdEntitlements();
  const {
    mutateAsync: deleteGroupsIdEntitlementsEntitlementId,
    isPending: isDeleteGroupsIdEntitlementsEntitlementIdPending,
  } = useDeleteGroupsIdEntitlementsEntitlementId();
  const {
    error: getGroupsIdIdentitiesError,
    data: existingIdentities,
    isFetching: isFetchingExistingIdentities,
  } = useGetGroupsIdIdentities(groupId);
  const {
    mutateAsync: patchGroupsIdIdentities,
    isPending: isPatchGroupsIdIdentitiesPending,
  } = usePatchGroupsIdIdentities();
  const {
    mutateAsync: deleteGroupsIdIdentitiesIdentityId,
    isPending: isDeleteGroupsIdIdentitiesIdentityIdPending,
  } = useDeleteGroupsIdIdentitiesIdentityId();
  const {
    error: getGroupsIdRolesError,
    data: existingRoles,
    isFetching: isFetchingExistingRoles,
  } = useGetGroupsIdRoles(groupId);
  const {
    mutateAsync: postGroupsIdRoles,
    isPending: isPostGroupsIdRolesPending,
  } = usePostGroupsIdRoles();
  const {
    mutateAsync: deleteGroupsIdRolesIdentityId,
    isPending: isDeleteGroupsIdRodeleteGroupsIdRolesIdentityIdPending,
  } = useDeleteGroupsIdRolesRolesId();
  return (
    <GroupPanel
      close={close}
      error={generateError(
        getGroupsIdEntitlementsError,
        getGroupsIdIdentitiesError,
        getGroupsIdRolesError,
      )}
      existingEntitlements={existingEntitlements?.data.data}
      existingIdentities={existingIdentities?.data.data}
      existingRoles={existingRoles?.data.data}
      isFetchingExistingEntitlements={isFetchingExistingEntitlements}
      isFetchingExistingIdentities={isFetchingExistingIdentities}
      isFetchingExistingRoles={isFetchingExistingRoles}
      isSaving={
        isDeleteGroupsIdEntitlementsEntitlementIdPending ||
        isPatchGroupsIdEntitlementsPending ||
        isPatchGroupsIdIdentitiesPending ||
        isDeleteGroupsIdIdentitiesIdentityIdPending ||
        isPostGroupsIdRolesPending ||
        isDeleteGroupsIdRodeleteGroupsIdRolesIdentityIdPending
      }
      onSubmit={async (
        { name },
        addEntitlements,
        addIdentities,
        addRoles,
        removeEntitlements,
        removeIdentities,
        removeRoles,
      ) => {
        // Currently the group name and ID are equivalent. This may change in
        // the backend, at which time this will need to change.
        const id = name;
        let hasEntitlementsError = false;
        let hasIdentitiesError = false;
        let hasRolesError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        if (addEntitlements.length) {
          queue.push(async (done) => {
            try {
              await patchGroupsIdEntitlements({
                id,
                data: {
                  permissions: addEntitlements.map(
                    ({ resource, entitlement, entity }) => ({
                      object: `${entity}:${resource}`,
                      relation: entitlement,
                    }),
                  ),
                },
              });
            } catch (error) {
              hasEntitlementsError = true;
            }
            done();
          });
        }
        if (removeEntitlements?.length) {
          removeEntitlements.forEach(({ resource, entitlement, entity }) => {
            queue.push(async (done) => {
              try {
                await deleteGroupsIdEntitlementsEntitlementId({
                  id,
                  entitlementId: `${entitlement}::${entity}:${resource}`,
                });
              } catch (error) {
                hasEntitlementsError = true;
              }
              done();
            });
          });
        }
        if (addIdentities.length) {
          queue.push(async (done) => {
            try {
              await patchGroupsIdIdentities({
                id,
                data: {
                  identities: addIdentities,
                },
              });
            } catch (error) {
              hasIdentitiesError = true;
            }
            done();
          });
        }
        if (removeIdentities?.length) {
          removeIdentities.forEach((identityId) => {
            queue.push(async (done) => {
              try {
                await deleteGroupsIdIdentitiesIdentityId({
                  id,
                  identityId,
                });
              } catch (error) {
                hasIdentitiesError = true;
              }
              done();
            });
          });
        }
        if (addRoles.length) {
          queue.push(async (done) => {
            try {
              await postGroupsIdRoles({
                id,
                data: {
                  roles: addRoles,
                },
              });
            } catch (error) {
              hasRolesError = true;
            }
            done();
          });
        }
        if (removeRoles?.length) {
          removeRoles.forEach((rolesId) => {
            queue.push(async (done) => {
              try {
                await deleteGroupsIdRolesIdentityId({
                  id,
                  rolesId,
                });
              } catch (error) {
                hasRolesError = true;
              }
              done();
            });
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
                {`Group "${id}" was updated.`}
              </ToastCard>
            ));
          }
        });
      }}
      groupId={groupId}
      setPanelWidth={setPanelWidth}
    />
  );
};

export default EditGroupPanel;
