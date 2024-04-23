import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import {
  useDeleteGroupsIdEntitlementsEntitlementId,
  useGetGroupsIdEntitlements,
  usePatchGroupsIdEntitlements,
} from "api/groups-id/groups-id";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";

import GroupPanel from "../GroupPanel";

import type { Props } from "./types";

const EditGroupPanel = ({ close, groupId }: Props) => {
  const {
    error: getGroupsIdEntitlementsError,
    data: existingEntitlements,
    isFetching: isFetchingExistingEntitlements,
  } = useGetGroupsIdEntitlements(groupId);
  const {
    mutateAsync: patchGroupsIdEntitlements,
    isPending: isPatchGroupsIdEntitlementsPending,
  } = usePatchGroupsIdEntitlements();
  const {
    mutateAsync: deleteGroupsIdEntitlementsEntitlementId,
    isPending: isDeleteGroupsIdEntitlementsEntitlementIdPending,
  } = useDeleteGroupsIdEntitlementsEntitlementId();
  return (
    <GroupPanel
      close={close}
      error={
        getGroupsIdEntitlementsError
          ? `Unable to get entitlements: ${getGroupsIdEntitlementsError.response?.data.message}`
          : null
      }
      existingEntitlements={existingEntitlements?.data.data}
      isFetchingExistingEntitlements={isFetchingExistingEntitlements}
      isSaving={
        isDeleteGroupsIdEntitlementsEntitlementIdPending ||
        isPatchGroupsIdEntitlementsPending
      }
      onSubmit={async (
        { id },
        addEntitlements,
        _addIdentities,
        _addRoles,
        removeEntitlements,
      ) => {
        let hasError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        if (addEntitlements.length) {
          queue.push(async (done) => {
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
              hasError = true;
            }
            done();
          });
        }
        if (removeEntitlements?.length) {
          removeEntitlements.forEach(({ resource, entitlement, entity }) => {
            queue.push(async (done) => {
              try {
                await deleteGroupsIdEntitlementsEntitlementId({
                  id,
                  entitlementId: `${entitlement}::${entity}:${resource}`,
                });
              } catch (error) {
                hasError = true;
              }
              done();
            });
          });
        }
        queue.onDone(() => {
          close();
          if (hasError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                Some entitlements couldn't be updated
              </ToastCard>
            ));
          } else {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="positive">
                {`Group "${id}" was updated.`}
              </ToastCard>
            ));
          }
        });
      }}
      groupId={groupId}
    />
  );
};

export default EditGroupPanel;
