import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import { useDeleteGroupsId } from "api/groups-id/groups-id";
import DeleteEntityPanel from "components/DeleteEntityPanel";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import type { Props } from "./types";

const DeleteGroupsPanel = ({ groups, close }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteGroupsId, isPending: isDeleteGroupsIdPending } =
    useDeleteGroupsId();

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
            Some groups couldn't be deleted
          </ToastCard>
        ));
      } else {
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="positive">
            Selected groups have been deleted
          </ToastCard>
        ));
      }
    });
  };

  return (
    <DeleteEntityPanel
      entity="group"
      count={groups.length}
      onDelete={handleDeleteGroups}
      isDeletePending={isDeleteGroupsIdPending}
      close={close}
    />
  );
};

export default DeleteGroupsPanel;
