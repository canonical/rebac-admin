import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import {
  GroupEntitlementsPatchItemAllOfOp,
  GroupIdentitiesPatchItemOp,
  GroupRolesPatchItemOp,
} from "api/api.schemas";
import {
  usePatchGroupsItemEntitlements,
  usePatchGroupsItemIdentities,
  usePatchGroupsItemRoles,
  usePostGroups,
} from "api/groups/groups";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";
import { getIds } from "utils/getIds";

import GroupPanel from "../GroupPanel";

import { Label } from "./types";
import type { Props } from "./types";

const AddGroupPanel = ({ close, setPanelWidth }: Props) => {
  const queryClient = useQueryClient();
  const {
    error: postGroupsError,
    mutateAsync: postGroups,
    isPending: isPostGroupsPending,
  } = usePostGroups();
  const {
    mutateAsync: patchGroupsItemEntitlements,
    isPending: isPatchGroupsItemEntitlementsPending,
  } = usePatchGroupsItemEntitlements();
  const {
    mutateAsync: patchGroupsItemIdentities,
    isPending: isPatchGroupsItemIdentitiesPending,
  } = usePatchGroupsItemIdentities();
  const {
    mutateAsync: postGroupsItemRoles,
    isPending: isPostGroupsItemRolesPending,
  } = usePatchGroupsItemRoles();

  return (
    <GroupPanel
      close={close}
      error={
        postGroupsError
          ? `Unable to create group: ${postGroupsError.response?.data.message}`
          : null
      }
      isSaving={
        isPostGroupsPending ||
        isPatchGroupsItemEntitlementsPending ||
        isPatchGroupsItemIdentitiesPending ||
        isPostGroupsItemRolesPending
      }
      onSubmit={async ({ name }, addEntitlements, addIdentities, addRoles) => {
        let hasEntitlementsError = false;
        let hasIdentitiesError = false;
        let hasRolesError = false;
        let hasGroupIdError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        try {
          const { data: group } = await postGroups({ data: { name } });
          const groupId = group.id;
          if (groupId) {
            if (addEntitlements.length) {
              queue.push(async (done) => {
                try {
                  await patchGroupsItemEntitlements({
                    id: groupId,
                    data: {
                      patches: addEntitlements.map((entitlement) => ({
                        entitlement,
                        op: GroupEntitlementsPatchItemAllOfOp.add,
                      })),
                    },
                  });
                } catch (error) {
                  hasEntitlementsError = true;
                }
                done();
              });
            }
            if (addIdentities.length) {
              queue.push(async (done) => {
                try {
                  await patchGroupsItemIdentities({
                    id: groupId,
                    data: {
                      patches: getIds(addIdentities).map((id) => ({
                        identity: id,
                        op: GroupIdentitiesPatchItemOp.add,
                      })),
                    },
                  });
                } catch (error) {
                  hasIdentitiesError = true;
                }
                done();
              });
            }
            if (addRoles.length) {
              queue.push(async (done) => {
                try {
                  await postGroupsItemRoles({
                    id: groupId,
                    data: {
                      patches: getIds(addRoles).map((id) => ({
                        role: id,
                        op: GroupRolesPatchItemOp.add,
                      })),
                    },
                  });
                } catch (error) {
                  hasRolesError = true;
                }
                done();
              });
            }
          } else {
            hasGroupIdError = true;
          }
        } catch (error) {
          // These errors are handled by the errors returned by `usePostGroups`.
          return;
        }
        queue.onDone(() => {
          void queryClient.invalidateQueries({
            queryKey: [Endpoint.GROUPS],
          });
          close();
          if (hasGroupIdError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.GROUP_ID_ERROR}
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
          if (hasIdentitiesError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.IDENTITIES_ERROR}
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
          reactHotToast.custom((t) => (
            <ToastCard toastInstance={t} type="positive">
              {`Group "${name}" was created.`}
            </ToastCard>
          ));
        });
      }}
      setPanelWidth={setPanelWidth}
    />
  );
};

export default AddGroupPanel;
