import Limiter from "async-limiter";
import type { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import type { Response } from "api/api.schemas";
import {
  useDeleteRolesIdEntitlementsEntitlementId,
  useGetRolesId,
  useGetRolesIdEntitlements,
  usePatchRolesIdEntitlements,
} from "api/roles-id/roles-id";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";

import RolePanel from "../RolePanel";

import type { Props } from "./types";

const generateError = (
  getRolesIdEntitlementsError: AxiosError<Response> | null,
  getRolesIdError: AxiosError<Response> | null,
  noRole: boolean,
) => {
  if (getRolesIdError) {
    return `Unable to get role: ${getRolesIdError.response?.data.message}`;
  }
  if (noRole) {
    return "Unable to get role";
  }
  if (getRolesIdEntitlementsError) {
    return `Unable to get entitlements: ${getRolesIdEntitlementsError.response?.data.message}`;
  }
  return null;
};

const EditRolePanel = ({ close, roleId, setPanelWidth }: Props) => {
  const {
    error: getRolesIdError,
    data: roleDetails,
    isFetching: isFetchingRole,
    isFetched: isFetchedRole,
  } = useGetRolesId(roleId);
  const {
    error: getRolesIdEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExisting,
  } = useGetRolesIdEntitlements(roleId);
  const {
    mutateAsync: patchRolesIdEntitlements,
    isPending: isPatchRolesIdEntitlementsPending,
  } = usePatchRolesIdEntitlements();
  const {
    mutateAsync: deleteRolesIdEntitlementsEntitlementId,
    isPending: isDeleteRolesIdEntitlementsEntitlementIdPending,
  } = useDeleteRolesIdEntitlementsEntitlementId();
  const role = roleDetails?.data.data.find(({ id }) => id === roleId);
  return (
    <RolePanel
      close={close}
      error={generateError(
        getRolesIdEntitlementsError,
        getRolesIdError,
        isFetchedRole && !role,
      )}
      existingEntitlements={existingEntitlements?.data.data}
      isEditing
      isFetchingExisting={isFetchingExisting}
      isFetchingRole={isFetchingRole}
      isSaving={
        isDeleteRolesIdEntitlementsEntitlementIdPending ||
        isPatchRolesIdEntitlementsPending
      }
      onSubmit={async (_values, addEntitlements, removeEntitlements) => {
        let hasError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        if (addEntitlements.length) {
          queue.push(async (done) => {
            try {
              await patchRolesIdEntitlements({
                id: roleId,
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
              hasError = true;
            }
            done();
          });
        }
        if (removeEntitlements?.length) {
          removeEntitlements.forEach(({ resource, entitlement, entity }) => {
            queue.push(async (done) => {
              try {
                await deleteRolesIdEntitlementsEntitlementId({
                  id: roleId,
                  entitlementId: `${entitlement}::${entity}:${resource}`,
                });
              } catch (error) {
                hasError = true;
              }
              done();
            });
          });
        }
        queue.onDone(() => {
          close();
          if (hasError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                Some entitlements couldn't be updated
              </ToastCard>
            ));
          } else {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="positive">
                {`Role "${role?.name}" was updated.`}
              </ToastCard>
            ));
          }
        });
      }}
      role={role}
      setPanelWidth={setPanelWidth}
    />
  );
};

export default EditRolePanel;
