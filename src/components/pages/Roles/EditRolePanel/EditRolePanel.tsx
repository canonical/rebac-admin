import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import {
  useDeleteRolesIdEntitlementsEntitlementId,
  useGetRolesIdEntitlements,
  usePatchRolesIdEntitlements,
} from "api/roles-id/roles-id";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";

import RolePanel from "../RolePanel";

import type { Props } from "./types";

const EditRolePanel = ({ close, roleId }: Props) => {
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
  return (
    <RolePanel
      close={close}
      error={
        getRolesIdEntitlementsError
          ? `Unable to create role: ${getRolesIdEntitlementsError.response?.data.message}`
          : null
      }
      existingEntitlements={existingEntitlements?.data.data}
      isFetchingExisting={isFetchingExisting}
      isSaving={
        isDeleteRolesIdEntitlementsEntitlementIdPending ||
        isPatchRolesIdEntitlementsPending
      }
      onSubmit={async ({ id }, addEntitlements, removeEntitlements) => {
        let hasError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        if (addEntitlements.length) {
          queue.push(async (done) => {
            try {
              await patchRolesIdEntitlements({
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
                  id,
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
                {`Role "${id}" was updated.`}
              </ToastCard>
            ));
          }
        });
      }}
      roleId={roleId}
    />
  );
};

export default EditRolePanel;
