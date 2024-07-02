import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import { useDeleteRolesItem } from "api/roles/roles";
import DeleteEntityPanel from "components/DeleteEntityPanel";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import { Label, type Props } from "./types";

const DeleteRolesPanel = ({ roles, close }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteRolesId, isPending: isDeleteRolesIdPending } =
    useDeleteRolesItem();

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
            {Label.DELETE_ERROR_MESSAGE}
          </ToastCard>
        ));
      } else {
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="positive">
            {Label.DEELTE_SUCCESS_MESSAGE}
          </ToastCard>
        ));
      }
    });
  };

  return (
    <DeleteEntityPanel
      entity="role"
      count={roles.length}
      onDelete={handleDeleteRoles}
      isDeletePending={isDeleteRolesIdPending}
      close={close}
    />
  );
};

export default DeleteRolesPanel;
