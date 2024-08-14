import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import { useDeleteIdentitiesItem } from "api/identities/identities";
import DeleteEntityModal from "components/DeleteEntityModal";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import { Label, type Props } from "./types";

const DeleteUsersModal = ({ identities, close }: Props) => {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteIdentitiesId,
    isPending: isDeleteIdentitiesIdPending,
  } = useDeleteIdentitiesItem();

  const handleDeleteIdentities = async () => {
    let hasError = false;
    const queue = new Limiter({ concurrency: API_CONCURRENCY });
    identities.forEach((id) => {
      queue.push(async (done) => {
        try {
          await deleteIdentitiesId({
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
        queryKey: [Endpoint.IDENTITIES],
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
      entity="user"
      count={identities.length}
      onDelete={handleDeleteIdentities}
      isDeletePending={isDeleteIdentitiesIdPending}
      close={close}
    />
  );
};

export default DeleteUsersModal;
