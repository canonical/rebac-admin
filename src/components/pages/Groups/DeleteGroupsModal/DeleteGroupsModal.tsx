import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import { useDeleteGroupsItem } from "api/groups/groups";
import DeleteEntityModal from "components/DeleteEntityModal";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import { Label, type Props } from "./types";

const DeleteGroupsModal = ({ groups, close }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteGroupsId, isPending: isDeleteGroupsIdPending } =
    useDeleteGroupsItem();

  const handleDeleteGroups = async () => {
    let hasError = false;
    const queue = new Limiter({ concurrency: API_CONCURRENCY });
    groups.forEach((id) => {
      queue.push(async (done) => {
        try {
          await deleteGroupsId({
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
        queryKey: [Endpoint.GROUPS],
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
      entity="group"
      count={groups.length}
      onDelete={handleDeleteGroups}
      isDeletePending={isDeleteGroupsIdPending}
      close={close}
    />
  );
};

export default DeleteGroupsModal;
