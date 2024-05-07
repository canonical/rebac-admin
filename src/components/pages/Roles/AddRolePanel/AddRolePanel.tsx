import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import { usePostRoles } from "api/roles/roles";
import { usePatchRolesIdEntitlements } from "api/roles-id/roles-id";
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
    mutateAsync: patchRolesIdEntitlements,
    isPending: isPatchRolesIdEntitlementsPending,
  } = usePatchRolesIdEntitlements();

  return (
    <RolePanel
      close={close}
      error={
        postRolesError
          ? `Unable to create role: ${postRolesError.response?.data.message}`
          : null
      }
      isSaving={isPostRolesPending || isPatchRolesIdEntitlementsPending}
      onSubmit={async ({ name }, addEntitlements) => {
        let id: string | null = null;
        try {
          const roles = await postRoles({ data: { name } });
          const role = roles?.data.data.find(
            (newRole) => newRole.name === name,
          );
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
