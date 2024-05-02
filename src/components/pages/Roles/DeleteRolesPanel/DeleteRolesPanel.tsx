import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import { useDeleteRolesId } from "api/roles-id/roles-id";
import DeleteEntityPanel from "components/DeleteEntityPanel";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import { type Props } from "./types";

const DeleteRolePanel = ({ roles, close }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteRolesId, isPending: isDeleteRolesIdPending } =
    useDeleteRolesId();

  const handleDeleteRoles = async () => {
    let hasError = false;
    const queue = new Limiter({ concurrency: API_CONCURRENCY });
    roles.forEach((id) => {
      queue.push(async (done) => {
        try {
          await deleteRolesId({
            id,
          });
        } catch (error) {
          hasError = true;
        }
        done();
      });
    });
    queue.onDone(() => {
      void queryClient.invalidateQueries({
        queryKey: [Endpoint.ROLES],
      });
      close();
      if (hasError) {
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="negative">
            Some roles couldn't be deleted
          </ToastCard>
        ));
      } else {
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="positive">
            Selected roles have been deleted
          </ToastCard>
        ));
      }
    });
  };

  return (
    <DeleteEntityPanel
      entityName="role"
      entities={roles}
      onDelete={handleDeleteRoles}
      isDeletePending={isDeleteRolesIdPending}
      close={close}
    />
  );
};

export default DeleteRolePanel;
