import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";

import {
  IdentityEntitlementsPatchItemAllOfOp,
  IdentityGroupsPatchItemOp,
  IdentityRolesPatchItemOp,
} from "api/api.schemas";
import {
  usePatchIdentitiesItemEntitlements,
  usePatchIdentitiesItemGroups,
  usePatchIdentitiesItemRoles,
  usePostIdentities,
} from "api/identities/identities";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";
import { getIds } from "utils/getIds";

import UserPanel from "../UserPanel";

import { Label, type Props } from "./types";

const AddUserPanel = ({ close, setPanelWidth }: Props) => {
  const queryClient = useQueryClient();
  const {
    error: postIdentitiesError,
    mutateAsync: postIdentities,
    isPending: isPostIdentitiesPending,
  } = usePostIdentities();
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
      setPanelWidth={setPanelWidth}
      isSaving={
        isPostIdentitiesPending ||
        isPatchIdentitiesItemGroupsPending ||
        isPatchIdentitiesItemRolesPending ||
        isPatchIdentitiesItemEntitlementsPending
      }
      error={
        postIdentitiesError
          ? `Unable to create local user: ${postIdentitiesError.response?.data.message}`
          : null
      }
      onSubmit={async (
        { email, firstName, lastName },
        addGroups,
        addRoles,
        addEntitlements,
      ) => {
        let hasIdentityIdError = false;
        let hasGroupsError = false;
        let hasRolesError = false;
        let hasEntitlementsError = false;
        const queue = new Limiter({ concurrency: API_CONCURRENCY });
        try {
          const { data: identity } = await postIdentities({
            data: {
              email,
              firstName: firstName || undefined,
              lastName: lastName || undefined,
              addedBy: "admin",
              source: "local",
            },
          });
          const identityId = identity.id;
          if (identityId) {
            if (addGroups.length) {
              queue.push(async (done) => {
                try {
                  await patchIdentitiesItemGroups({
                    id: identityId,
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
                    id: identityId,
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
            if (addEntitlements.length) {
              queue.push(async (done) => {
                try {
                  await patchIdentitiesItemEntitlements({
                    id: identityId,
                    data: {
                      patches: addEntitlements.map((entitlement) => ({
                        entitlement,
                        op: IdentityEntitlementsPatchItemAllOfOp.add,
                      })),
                    },
                  });
                } catch (error) {
                  hasEntitlementsError = true;
                }
                done();
              });
            }
          } else {
            hasIdentityIdError = true;
          }
        } catch {
          // These errors are handled by the errors returned by `usePostIdentities`.
          return;
        }
        queue.onDone(() => {
          void queryClient.invalidateQueries({
            queryKey: [Endpoint.IDENTITIES],
          });
          close();
          if (hasIdentityIdError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {Label.IDENTITY_ID_ERROR}
              </ToastCard>
            ));
          }
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
          reactHotToast.custom((t) => (
            <ToastCard toastInstance={t} type="positive">
              {`User with email "${email}" was created.`}
            </ToastCard>
          ));
        });
      }}
    />
  );
};

export default AddUserPanel;
