import { useQueryClient } from "@tanstack/react-query";
import reactHotToast from "react-hot-toast";

import { usePostRoles } from "api/roles/roles";
import ToastCard from "components/ToastCard";
import { Endpoint } from "types/api";

import RolePanel from "../RolePanel";

import type { Props } from "./types";

const AddRolePanel = ({ close }: Props) => {
  const queryClient = useQueryClient();
  const { error, mutate, isPending } = usePostRoles();

  return (
    <RolePanel
      close={close}
      error={
        error ? `Unable to create role: ${error.response?.data.message}` : null
      }
      isSaving={isPending}
      onSubmit={({ id }) => {
        mutate(
          { data: { id } },
          {
            onSuccess: ({ data }) => {
              close();
              reactHotToast.custom((t) => (
                <ToastCard toastInstance={t} type="positive">
                  {data.message}
                </ToastCard>
              ));
              void queryClient.invalidateQueries({
                queryKey: [Endpoint.ROLES],
              });
            },
          },
        );
      }}
    />
  );
};

export default AddRolePanel;
