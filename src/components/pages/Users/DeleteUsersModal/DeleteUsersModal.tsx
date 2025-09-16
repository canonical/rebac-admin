import { useQueryClient } from "@tanstack/react-query";
import PQueue from "p-queue";
import type { FC } from "react";
import reactHotToast from "react-hot-toast";

import { useDeleteIdentitiesItem } from "api/identities/identities";
import DeleteEntityModal from "components/DeleteEntityModal";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import { Label, type Props } from "./types";

const DeleteUsersModal: FC<Props> = ({
  identities,
  close,
  onDeleted,
}: Props) => {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteIdentitiesId,
    isPending: isDeleteIdentitiesIdPending,
  } = useDeleteIdentitiesItem();

  const handleDeleteIdentities = async (): Promise<void> => {
    let hasError = false;
    const queue = new PQueue({ concurrency: API_CONCURRENCY });
    for (const id of identities) {
      await queue.add(async () => {
        try {
          await deleteIdentitiesId({
            id,
          });
        } catch (error) {
          hasError = true;
        }
      });
    }
    void queue.onIdle().then(() => {
      void queryClient.invalidateQueries({
        queryKey: [Endpoint.IDENTITIES],
      });
      onDeleted?.();
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
      entity="user"
      count={identities.length}
      onDelete={handleDeleteIdentities}
      isDeletePending={isDeleteIdentitiesIdPending}
      close={close}
    />
  );
};

export default DeleteUsersModal;
