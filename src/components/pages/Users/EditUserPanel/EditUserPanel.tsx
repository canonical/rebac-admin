import Limiter from "async-limiter";
import type { AxiosError } from "axios";
import reactHotToast from "react-hot-toast";

import type { IdentityEntitlementsPatchItem, Response } from "api/api.schemas";
import { IdentityEntitlementsPatchItemAllOfOp } from "api/api.schemas";
import {
  useGetIdentitiesItemEntitlements,
  usePatchIdentitiesItemEntitlements,
} from "api/identities/identities";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";

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
      isSaving={isPatchIdentitiesItemEntitlementsPending}
      onSubmit={async (
        _values,
        _addGroups,
        _addRoles,
        addEntitlements,
        removeEntitlements,
      ) => {
        let hasEntitlementsError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
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
                {`User "${user?.firstName} ${user?.lastName}" was updated.`}
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
