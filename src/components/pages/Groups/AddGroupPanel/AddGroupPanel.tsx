import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import { usePostGroups } from "api/groups/groups";
import {
  usePatchGroupsIdEntitlements,
  usePatchGroupsIdIdentities,
  usePostGroupsIdRoles,
} from "api/groups-id/groups-id";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

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
    mutateAsync: patchGroupsIdEntitlements,
    isPending: isPatchGroupsIdEntitlementsPending,
  } = usePatchGroupsIdEntitlements();
  const {
    mutateAsync: patchGroupsIdIdentities,
    isPending: isPatchGroupsIdIdentitiesPending,
  } = usePatchGroupsIdIdentities();
  const {
    mutateAsync: postGroupsIdRoles,
    isPending: isPostGroupsIdRolesPending,
  } = usePostGroupsIdRoles();

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
        isPatchGroupsIdEntitlementsPending ||
        isPatchGroupsIdIdentitiesPending ||
        isPostGroupsIdRolesPending
      }
      onSubmit={async ({ id }, addEntitlements, addIdentities, addRoles) => {
        try {
          await postGroups({ data: { id } });
        } catch (error) {
          // These errors are handled by the errors returned by `usePostGroups`.
          return;
        }
        let hasEntitlementsError = false;
        let hasIdentitiesError = false;
        let hasRolesError = false;
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
              hasEntitlementsError = true;
            }
            done();
          });
        }
        if (addIdentities.length) {
          queue.push(async (done) => {
            try {
              await patchGroupsIdIdentities({
                id,
                data: {
                  identities: addIdentities,
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
              await postGroupsIdRoles({
                id,
                data: {
                  roles: addRoles,
                },
              });
            } catch (error) {
              hasRolesError = true;
            }
            done();
          });
        }
        queue.onDone(() => {
          void queryClient.invalidateQueries({
            queryKey: [Endpoint.GROUPS],
          });
          close();
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
              {`Group "${id}" was created.`}
            </ToastCard>
          ));
        });
      }}
      setPanelWidth={setPanelWidth}
    />
  );
};

export default AddGroupPanel;
