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
        // Currently the role name and ID are equivalent. This may change in
        // the backend, at which time this will need to change.
        const id = name;
        try {
          await postRoles({ data: { id, name } });
        } catch (error) {
          // These errors are handled by the errors returned by `usePostRoles`.
          return;
        }
        if (addEntitlements.length) {
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
        void queryClient.invalidateQueries({
          queryKey: [Endpoint.ROLES],
        });
        close();
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="positive">
            {`Role "${id}" was created.`}
          </ToastCard>
        ));
      }}
      setPanelWidth={setPanelWidth}
    />
  );
};

export default AddRolePanel;
