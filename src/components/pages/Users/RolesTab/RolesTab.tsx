import {
  Spinner,
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { IdentityRolesPatchItemOp } from "api/api.schemas";
import type { Role } from "api/api.schemas";
import {
  useGetIdentitiesItemRoles,
  usePatchIdentitiesItemRoles,
} from "api/identities/identities";
import RolesPanelForm from "components/RolesPanelForm";
import { getIds } from "utils/getIds";

import { Label } from "./types";

const updateRoles = (
  userId: string,
  roles: Role[],
  queryClient: QueryClient,
  queryKey: QueryKey,
  op: IdentityRolesPatchItemOp,
  patchRoles: ReturnType<typeof usePatchIdentitiesItemRoles>["mutateAsync"],
) => {
  patchRoles({
    id: userId,
    data: {
      patches: getIds(roles).map((roleId) => ({
        role: roleId,
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
      // this error is handled by the usePatchIdentitiesItemRoles hook.
    });
};

const RolesTab = () => {
  const { id: userId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const {
    isError: isFetchError,
    data,
    isFetching,
    isRefetching,
    queryKey,
  } = useGetIdentitiesItemRoles(userId ?? "");
  const existingRoles = data?.data.data;
  const { mutateAsync, isError: isPatchError } = usePatchIdentitiesItemRoles();

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
    <RolesPanelForm
      existingRoles={existingRoles}
      setAddRoles={(addRoles) =>
        updateRoles(
          userId,
          addRoles,
          queryClient,
          queryKey,
          IdentityRolesPatchItemOp.add,
          mutateAsync,
        )
      }
      setRemoveRoles={(removeRoles) =>
        updateRoles(
          userId,
          removeRoles,
          queryClient,
          queryKey,
          IdentityRolesPatchItemOp.remove,
          mutateAsync,
        )
      }
    />
  );
};

export default RolesTab;
