import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import { RoleEntitlementsPatchItemAllOfOp } from "api/api.schemas";
import { usePatchRolesItemEntitlements, usePostRoles } from "api/roles/roles";
import ToastCard from "components/ToastCard";
import { Endpoint } from "types/api";

import RolePanel from "../RolePanel";

import type { Props } from "./types";

const AddRolePanel = ({ close, setPanelWidth }: Props) => {
  const queryClient = useQueryClient();
  const {
    error: postRolesError,
    mutateAsync: postRoles,
    isPending: isPostRolesPending,
  } = usePostRoles();
  const {
    mutateAsync: patchRolesItemEntitlements,
    isPending: isPatchRolesItemEntitlementsPending,
  } = usePatchRolesItemEntitlements();

  return (
    <RolePanel
      close={close}
      error={
        postRolesError
          ? `Unable to create role: ${postRolesError.response?.data.message}`
          : null
      }
      isSaving={isPostRolesPending || isPatchRolesItemEntitlementsPending}
      onSubmit={async ({ name }, addEntitlements) => {
        let id: string | null = null;
        try {
          const roles = await postRoles({ data: { name } });
          const role = roles?.data.find((newRole) => newRole.name === name);
          id = role?.id ?? null;
        } catch (error) {
          // These errors are handled by the errors returned by `usePostRoles`.
          return;
        }
        if (addEntitlements.length) {
          if (!id) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {`Entitlements couldn't be added to role "${name}".`}
              </ToastCard>
            ));
          } else {
            try {
              await patchRolesItemEntitlements({
                id,
                data: {
                  patches: addEntitlements.map((entitlement) => ({
                    entitlement: entitlement,
                    op: RoleEntitlementsPatchItemAllOfOp.add,
                  })),
                },
              });
            } catch (error) {
              reactHotToast.custom((t) => (
                <ToastCard toastInstance={t} type="negative">
                  {`Entitlements couldn't be added: "${
                    error instanceof AxiosError
                      ? error.response?.data.message
                      : "unknown error"
                  }".`}
                </ToastCard>
              ));
            }
          }
        }
        void queryClient.invalidateQueries({
          queryKey: [Endpoint.ROLES],
        });
        close();
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="positive">
            {`Role "${name}" was created.`}
          </ToastCard>
        ));
      }}
      setPanelWidth={setPanelWidth}
    />
  );
};

export default AddRolePanel;
