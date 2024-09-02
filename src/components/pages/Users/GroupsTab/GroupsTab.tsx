import {
  Spinner,
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { IdentityGroupsPatchItemOp } from "api/api.schemas";
import type { Group } from "api/api.schemas";
import {
  useGetIdentitiesItemGroups,
  usePatchIdentitiesItemGroups,
} from "api/identities/identities";
import GroupsPanelForm from "components/GroupsPanelForm";
import { getIds } from "utils/getIds";

import { Label } from "./types";

const updateGroups = (
  userId: string,
  groups: Group[],
  queryClient: QueryClient,
  queryKey: QueryKey,
  op: IdentityGroupsPatchItemOp,
  patchGroups: ReturnType<typeof usePatchIdentitiesItemGroups>["mutateAsync"],
) => {
  patchGroups({
    id: userId,
    data: {
      patches: getIds(groups).map((groupId) => ({
        group: groupId,
        op,
      })),
    },
  })
    .then(() =>
      queryClient.invalidateQueries({
        queryKey,
      }),
    )
    .catch(() => {
      // this error is handled by the usePatchIdentitiesItemGroups hook.
    });
};

const GroupsTab = () => {
  const { id: userId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const {
    isError: isFetchError,
    data,
    isFetching,
    isRefetching,
    queryKey,
  } = useGetIdentitiesItemGroups(userId ?? "");
  const existingGroups = data?.data.data;
  const { mutateAsync, isError: isPatchError } = usePatchIdentitiesItemGroups();

  if (!userId) {
    // Loading states and errors for the user are handled in the parent
    // `User` component.
    return null;
  }
  if (isFetching && !isRefetching) {
    return <Spinner />;
  }
  if (isFetchError) {
    return (
      <Notification severity={NotificationSeverity.NEGATIVE}>
        {Label.FETCH_ERROR}
      </Notification>
    );
  }
  if (isPatchError) {
    return (
      <Notification severity={NotificationSeverity.NEGATIVE}>
        {Label.PATCH_ERROR}
      </Notification>
    );
  }
  return (
    <GroupsPanelForm
      existingGroups={existingGroups}
      setAddGroups={(addGroups) =>
        updateGroups(
          userId,
          addGroups,
          queryClient,
          queryKey,
          IdentityGroupsPatchItemOp.add,
          mutateAsync,
        )
      }
      setRemoveGroups={(removeGroups) =>
        updateGroups(
          userId,
          removeGroups,
          queryClient,
          queryKey,
          IdentityGroupsPatchItemOp.remove,
          mutateAsync,
        )
      }
    />
  );
};

export default GroupsTab;
