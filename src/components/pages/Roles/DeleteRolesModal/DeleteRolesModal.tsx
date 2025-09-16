import { useQueryClient } from "@tanstack/react-query";
import PQueue from "p-queue";
import type { FC } from "react";
import reactHotToast from "react-hot-toast";

import { useDeleteRolesItem } from "api/roles/roles";
import DeleteEntityModal from "components/DeleteEntityModal";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import { Label, type Props } from "./types";

const DeleteRolesModal: FC<Props> = ({ roles, close }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteRolesId, isPending: isDeleteRolesIdPending } =
    useDeleteRolesItem();

  const handleDeleteRoles = async (): Promise<void> => {
    let hasError = false;
    const queue = new PQueue({ concurrency: API_CONCURRENCY });
    for (const id of roles) {
      await queue.add(async () => {
        try {
          await deleteRolesId({
            id,
          });
        } catch (error) {
          hasError = true;
        }
      });
    }
    void queue.onIdle().then(() => {
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
    <DeleteEntityModal
      entity="role"
      count={roles.length}
      onDelete={handleDeleteRoles}
      isDeletePending={isDeleteRolesIdPending}
      close={close}
    />
  );
};

export default DeleteRolesModal;
