import {
  Spinner,
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import type { EntityEntitlement } from "api/api.schemas";
import { IdentityEntitlementsPatchItemAllOfOp } from "api/api.schemas";
import {
  useGetIdentitiesItemEntitlements,
  usePatchIdentitiesItemEntitlements,
} from "api/identities/identities";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import { CapabilityAction, useCheckCapability } from "hooks/capabilities";
import { Endpoint } from "types/api";

import { Label } from "./types";

const updateEntitlements = (
  userId: string,
  entitlements: EntityEntitlement[],
  queryClient: QueryClient,
  queryKey: QueryKey,
  op: IdentityEntitlementsPatchItemAllOfOp,
  patchEntitlements: ReturnType<
    typeof usePatchIdentitiesItemEntitlements
  >["mutateAsync"],
) => {
  patchEntitlements({
    id: userId,
    data: {
      patches: entitlements.map((entitlement) => ({
        entitlement,
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
      // this error is handled by the usePatchIdentitiesItemEntitlements hook.
    });
};

const EntitlementsTab = () => {
  const { id: userId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { hasCapability: canGetEntitlements } = useCheckCapability(
    Endpoint.IDENTITY_ENTITLEMENTS,
    CapabilityAction.READ,
  );
  const { hasCapability: canRelateEntitlements } = useCheckCapability(
    Endpoint.IDENTITY_ENTITLEMENTS,
    CapabilityAction.RELATE,
  );
  const {
    isError: isFetchError,
    data,
    isFetching,
    isRefetching,
    queryKey,
  } = useGetIdentitiesItemEntitlements(userId ?? "", undefined, {
    query: { enabled: canGetEntitlements },
  });
  const existingEntitlements = data?.data.data;
  const {
    mutateAsync,
    isPending,
    isError: isPatchError,
  } = usePatchIdentitiesItemEntitlements();

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
        {Label.FETCH_ENTITLEMENTS_ERROR}
      </Notification>
    );
  }
  if (isPatchError) {
    return (
      <Notification severity={NotificationSeverity.NEGATIVE}>
        {Label.PATCH_ENTITLEMENTS_ERROR}
      </Notification>
    );
  }
  return (
    <EntitlementsPanelForm
      existingEntitlements={existingEntitlements}
      setAddEntitlements={
        canRelateEntitlements
          ? (addEntitlements) =>
              updateEntitlements(
                userId,
                addEntitlements,
                queryClient,
                queryKey,
                IdentityEntitlementsPatchItemAllOfOp.add,
                mutateAsync,
              )
          : null
      }
      setRemoveEntitlements={
        canRelateEntitlements
          ? (removeEntitlements) =>
              updateEntitlements(
                userId,
                removeEntitlements,
                queryClient,
                queryKey,
                IdentityEntitlementsPatchItemAllOfOp.remove,
                mutateAsync,
              )
          : null
      }
      showTable={canGetEntitlements}
      submitProps={{ loading: isPending }}
    />
  );
};

export default EntitlementsTab;
