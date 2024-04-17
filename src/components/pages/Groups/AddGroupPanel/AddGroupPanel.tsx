import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import { usePostGroups } from "api/groups/groups";
import { usePatchGroupsIdEntitlements } from "api/groups-id/groups-id";
import ToastCard from "components/ToastCard";
import { Endpoint } from "types/api";

import GroupPanel from "../GroupPanel";

import type { Props } from "./types";

const AddGroupPanel = ({ close }: Props) => {
  const queryClient = useQueryClient();
  const {
    error: postGroupsError,
    mutateAsync: postGroups,
    isPending: isPostGroupsPending,
  } = usePostGroups();
  const {
    mutateAsync: patchGroupsIdEntitlements,
    isPending: isPatchGroupsIdEntitlementsPending,
  } = usePatchGroupsIdEntitlements();

  return (
    <GroupPanel
      close={close}
      error={
        postGroupsError
          ? `Unable to create group: ${postGroupsError.response?.data.message}`
          : null
      }
      isSaving={isPostGroupsPending || isPatchGroupsIdEntitlementsPending}
      onSubmit={async ({ id }, addEntitlements) => {
        try {
          await postGroups({ data: { id } });
        } catch (error) {
          // These errors are handled by the errors returned by `usePostGroups`.
          return;
        }
        if (addEntitlements.length) {
          try {
            await patchGroupsIdEntitlements({
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
          queryKey: [Endpoint.GROUPS],
        });
        close();
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="positive">
            {`Group "${id}" was created.`}
          </ToastCard>
        ));
      }}
    />
  );
};

export default AddGroupPanel;
