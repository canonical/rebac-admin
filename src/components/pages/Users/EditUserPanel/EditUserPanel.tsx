import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import type { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import type {
  IdentityEntitlementsPatchItem,
  IdentityGroupsPatchItem,
  Response,
} from "api/api.schemas";
import {
  IdentityEntitlementsPatchItemAllOfOp,
  IdentityGroupsPatchItemOp,
} from "api/api.schemas";
import {
  useGetIdentitiesItemEntitlements,
  useGetIdentitiesItemGroups,
  usePatchIdentitiesItemEntitlements,
  usePatchIdentitiesItemGroups,
} from "api/identities/identities";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { getIds } from "utils/getIds";

import UserPanel from "../UserPanel";

import { Label } from "./types";
import type { Props } from "./types";

const generateError = (
  getIdentitiesItemGroupsError: AxiosError<Response> | null,
  getIdentitiesItemEntitlementsError: AxiosError<Response> | null,
) => {
  if (getIdentitiesItemGroupsError) {
    return `Unable to get groups: ${getIdentitiesItemGroupsError.response?.data.message}`;
  }
  if (getIdentitiesItemEntitlementsError) {
    return `Unable to get entitlements: ${getIdentitiesItemEntitlementsError.response?.data.message}`;
  }
  return null;
};

const EditUserPanel = ({ close, user, userId, setPanelWidth }: Props) => {
  const queryClient = useQueryClient();
  const {
    error: getIdentitiesItemGroupsError,
    data: existingGroups,
    isFetching: isFetchingExistingGroups,
    queryKey: groupsQueryKey,
  } = useGetIdentitiesItemGroups(userId);
  const {
    mutateAsync: patchIdentitiesItemGroups,
    isPending: isPatchIdentitiesItemGroupsPending,
  } = usePatchIdentitiesItemGroups();
  const {
    error: getIdentitiesItemEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExistingEntitlements,
    queryKey: entitlementsQueryKey,
  } = useGetIdentitiesItemEntitlements(userId);
  const {
    mutateAsync: patchIdentitiesItemEntitlements,
    isPending: isPatchIdentitiesItemEntitlementsPending,
  } = usePatchIdentitiesItemEntitlements();
  return (
    <UserPanel
      close={close}
      error={generateError(
        getIdentitiesItemGroupsError,
        getIdentitiesItemEntitlementsError,
      )}
      existingGroups={existingGroups?.data.data}
      existingEntitlements={existingEntitlements?.data.data}
      isEditing
      isFetchingExistingGroups={isFetchingExistingGroups}
      isFetchingExistingEntitlements={isFetchingExistingEntitlements}
      isSaving={
        isPatchIdentitiesItemGroupsPending ||
        isPatchIdentitiesItemEntitlementsPending
      }
      onSubmit={async (
        _values,
        addGroups,
        _addRoles,
        addEntitlements,
        removeGroups,
        removeEntitlements,
      ) => {
        let hasGroupsError = false;
        let hasEntitlementsError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        if (addGroups.length || removeGroups?.length) {
          let patches: IdentityGroupsPatchItem[] = [];
          if (addGroups.length) {
            patches = patches.concat(
              getIds(addGroups).map((id) => ({
                group: id,
                op: IdentityGroupsPatchItemOp.add,
              })),
            );
          }
          if (removeGroups?.length) {
            patches = patches.concat(
              getIds(removeGroups).map((id) => ({
                group: id,
                op: IdentityGroupsPatchItemOp.remove,
              })),
            );
          }
          queue.push(async (done) => {
            try {
              await patchIdentitiesItemGroups({
                id: userId,
                data: {
                  patches,
                },
              });
            } catch (error) {
              hasGroupsError = true;
            }
            done();
          });
        }
        if (addEntitlements.length || removeEntitlements?.length) {
          let patches: IdentityEntitlementsPatchItem[] = [];
          if (addEntitlements.length) {
            patches = patches.concat(
              addEntitlements.map((entitlement) => ({
                entitlement,
                op: IdentityEntitlementsPatchItemAllOfOp.add,
              })),
            );
          }
          if (removeEntitlements?.length) {
            patches = patches.concat(
              removeEntitlements.map((entitlement) => ({
                entitlement,
                op: IdentityEntitlementsPatchItemAllOfOp.remove,
              })),
            );
          }
          queue.push(async (done) => {
            try {
              await patchIdentitiesItemEntitlements({
                id: userId,
                data: {
                  patches,
                },
              });
            } catch (error) {
              hasEntitlementsError = true;
            }
            done();
          });
        }
        queue.onDone(() => {
          void queryClient.invalidateQueries({
            queryKey: groupsQueryKey,
          });
          void queryClient.invalidateQueries({
            queryKey: entitlementsQueryKey,
          });
          close();
          if (hasGroupsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.GROUPS_ERROR}
              </ToastCard>
            ));
          }
          if (hasEntitlementsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.ENTITLEMENTS_ERROR}
              </ToastCard>
            ));
          }
          if (!hasEntitlementsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="positive">
                {`User with email "${user.email}" was updated.`}
              </ToastCard>
            ));
          }
        });
      }}
      user={user}
      setPanelWidth={setPanelWidth}
    />
  );
};

export default EditUserPanel;
