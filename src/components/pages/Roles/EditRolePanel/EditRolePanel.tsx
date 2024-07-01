import Limiter from "async-limiter";
import type { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import type { Response } from "api/api.schemas";
import { RoleEntitlementsPatchItemAllOfOp } from "api/api.schemas";
import {
  useGetRolesItem,
  useGetRolesItemEntitlements,
  usePatchRolesItemEntitlements,
} from "api/roles/roles";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";

import RolePanel from "../RolePanel";

import type { Props } from "./types";

const generateError = (
  getRolesItemEntitlementsError: AxiosError<Response> | null,
  getRolesItemError: AxiosError<Response> | null,
  noRole: boolean,
) => {
  if (getRolesItemError) {
    return `Unable to get role: ${getRolesItemError.response?.data.message}`;
  }
  if (noRole) {
    return "Unable to get role";
  }
  if (getRolesItemEntitlementsError) {
    return `Unable to get entitlements: ${getRolesItemEntitlementsError.response?.data.message}`;
  }
  return null;
};

const EditRolePanel = ({ close, roleId, setPanelWidth }: Props) => {
  const {
    error: getRolesItemError,
    data: roleDetails,
    isFetching: isFetchingRole,
    isFetched: isFetchedRole,
  } = useGetRolesItem(roleId);
  const {
    error: getRolesItemEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExisting,
  } = useGetRolesItemEntitlements(roleId);
  const {
    mutateAsync: patchRolesItemEntitlements,
    isPending: isPatchRolesItemEntitlementsPending,
  } = usePatchRolesItemEntitlements();
  const {
    mutateAsync: deleteRolesItemEntitlements,
    isPending: isDeleteRolesItemEntitlementsPending,
  } = usePatchRolesItemEntitlements();
  const role = roleDetails?.data;
  return (
    <RolePanel
      close={close}
      error={generateError(
        getRolesItemEntitlementsError,
        getRolesItemError,
        isFetchedRole && !role,
      )}
      existingEntitlements={existingEntitlements?.data.data}
      isEditing
      isFetchingExisting={isFetchingExisting}
      isFetchingRole={isFetchingRole}
      isSaving={
        isDeleteRolesItemEntitlementsPending ||
        isPatchRolesItemEntitlementsPending
      }
      onSubmit={async (_values, addEntitlements, removeEntitlements) => {
        let hasError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        if (addEntitlements.length) {
          queue.push(async (done) => {
            try {
              await patchRolesItemEntitlements({
                id: roleId,
                data: {
                  patches: addEntitlements.map((entitlement) => ({
                    entitlement,
                    op: RoleEntitlementsPatchItemAllOfOp.add,
                  })),
                },
              });
            } catch (error) {
              hasError = true;
            }
            done();
          });
        }
        if (removeEntitlements?.length) {
          queue.push(async (done) => {
            try {
              await deleteRolesItemEntitlements({
                id: roleId,
                data: {
                  patches: removeEntitlements.map((entitlement) => ({
                    entitlement,
                    op: RoleEntitlementsPatchItemAllOfOp.remove,
                  })),
                },
              });
            } catch (error) {
              hasError = true;
            }
            done();
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
