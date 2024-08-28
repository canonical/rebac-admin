import Limiter from "async-limiter";
import type { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import type { IdentityEntitlementsPatchItem, Response } from "api/api.schemas";
import {
  IdentityEntitlementsPatchItemAllOfOp,
  IdentityGroupsPatchItemOp,
  IdentityRolesPatchItemOp,
} from "api/api.schemas";
import {
  useGetIdentitiesItemEntitlements,
  usePatchIdentitiesItemEntitlements,
  usePatchIdentitiesItemGroups,
  usePatchIdentitiesItemRoles,
} from "api/identities/identities";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { getIds } from "utils/getIds";

import UserPanel from "../UserPanel";

import { Label } from "./types";
import type { Props } from "./types";

const generateError = (
  getIdentitiesItemEntitlementsError: AxiosError<Response> | null,
) => {
  if (getIdentitiesItemEntitlementsError) {
    return `Unable to get entitlements: ${getIdentitiesItemEntitlementsError.response?.data.message}`;
  }
  return null;
};

const EditUserPanel = ({ close, user, userId, setPanelWidth }: Props) => {
  const {
    error: getIdentitiesItemEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExistingEntitlements,
  } = useGetIdentitiesItemEntitlements(userId);
  const {
    mutateAsync: patchIdentitiesItemGroups,
    isPending: isPatchIdentitiesItemGroupsPending,
  } = usePatchIdentitiesItemGroups();
  const {
    mutateAsync: patchIdentitiesItemRoles,
    isPending: isPatchIdentitiesItemRolesPending,
  } = usePatchIdentitiesItemRoles();
  const {
    mutateAsync: patchIdentitiesItemEntitlements,
    isPending: isPatchIdentitiesItemEntitlementsPending,
  } = usePatchIdentitiesItemEntitlements();
  return (
    <UserPanel
      close={close}
      error={generateError(getIdentitiesItemEntitlementsError)}
      existingEntitlements={existingEntitlements?.data.data}
      isEditing
      isFetchingExistingEntitlements={isFetchingExistingEntitlements}
      isSaving={
        isPatchIdentitiesItemGroupsPending ||
        isPatchIdentitiesItemRolesPending ||
        isPatchIdentitiesItemEntitlementsPending
      }
      onSubmit={async (
        _values,
        addGroups,
        addRoles,
        addEntitlements,
        removeEntitlements,
      ) => {
        let hasGroupsError = false;
        let hasRolesError = false;
        let hasEntitlementsError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        if (addGroups.length) {
          queue.push(async (done) => {
            try {
              await patchIdentitiesItemGroups({
                id: userId,
                data: {
                  patches: getIds(addGroups).map((id) => ({
                    group: id,
                    op: IdentityGroupsPatchItemOp.add,
                  })),
                },
              });
            } catch (error) {
              hasGroupsError = true;
            }
            done();
          });
        }
        if (addRoles.length) {
          queue.push(async (done) => {
            try {
              await patchIdentitiesItemRoles({
                id: userId,
                data: {
                  patches: getIds(addRoles).map((id) => ({
                    role: id,
                    op: IdentityRolesPatchItemOp.add,
                  })),
                },
              });
            } catch (error) {
              hasRolesError = true;
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
          close();
          if (hasGroupsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.GROUPS_ERROR}
              </ToastCard>
            ));
          }
          if (hasRolesError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.ROLES_ERROR}
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
          if (!hasGroupsError && !hasRolesError && !hasEntitlementsError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="positive">
                {`User "${user?.firstName}" "${user?.lastName}" was updated.`}
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
