import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import type { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import type { Response, RoleEntitlementsPatchItem } from "api/api.schemas";
import { RoleEntitlementsPatchItemAllOfOp } from "api/api.schemas";
import {
  useGetRolesItemEntitlements,
  usePatchRolesItemEntitlements,
  usePutRolesItem,
} from "api/roles/roles";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";

import RolePanel from "../RolePanel";

import { Label, type Props } from "./types";

const generateError = (
  getRolesItemEntitlementsError: AxiosError<Response> | null,
) => {
  if (getRolesItemEntitlementsError) {
    return `Unable to get entitlements: ${getRolesItemEntitlementsError.response?.data.message}`;
  }
  return null;
};

const EditRolePanel = ({
  close,
  onRoleUpdated,
  roleId,
  role,
  setPanelWidth,
}: Props) => {
  const queryClient = useQueryClient();
  const {
    error: getRolesItemEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExisting,
    queryKey: entitlementsQueryKey,
  } = useGetRolesItemEntitlements(roleId);
  const {
    mutateAsync: patchRolesItemEntitlements,
    isPending: isPatchRolesItemEntitlementsPending,
  } = usePatchRolesItemEntitlements();
  const { mutateAsync: putRolesItem, isPending: isPutRolesItemPending } =
    usePutRolesItem();
  return (
    <RolePanel
      close={close}
      error={generateError(getRolesItemEntitlementsError)}
      existingEntitlements={existingEntitlements?.data.data}
      isEditing
      isFetchingExisting={isFetchingExisting}
      isSaving={isPatchRolesItemEntitlementsPending || isPutRolesItemPending}
      onSubmit={async (
        values,
        roleChanged,
        addEntitlements,
        removeEntitlements,
      ) => {
        const errors: string[] = [];
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        if (roleChanged) {
          queue.push(async (done) => {
            try {
              await putRolesItem({
                id: roleId,
                data: {
                  ...role,
                  ...values,
                },
              });
              onRoleUpdated();
            } catch (error) {
              errors.push(Label.ERROR_ROLE);
            }
            done();
          });
        }
        if (addEntitlements.length || removeEntitlements?.length) {
          let patches: RoleEntitlementsPatchItem[] = [];
          if (addEntitlements.length) {
            patches = patches.concat(
              addEntitlements.map((entitlement) => ({
                entitlement,
                op: RoleEntitlementsPatchItemAllOfOp.add,
              })),
            );
          }
          if (removeEntitlements?.length) {
            patches = patches.concat(
              removeEntitlements.map((entitlement) => ({
                entitlement,
                op: RoleEntitlementsPatchItemAllOfOp.remove,
              })),
            );
          }
          queue.push(async (done) => {
            try {
              await patchRolesItemEntitlements({
                id: roleId,
                data: {
                  patches,
                },
              });
              await queryClient.invalidateQueries({
                queryKey: entitlementsQueryKey,
              });
            } catch (error) {
              errors.push(Label.ERROR_ENTITLEMENTS);
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
                {`Role "${values.name}" was updated.`}
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
