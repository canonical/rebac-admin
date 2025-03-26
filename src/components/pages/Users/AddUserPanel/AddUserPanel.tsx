import { useQueryClient } from "@tanstack/react-query";
import PQueue from "p-queue";
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
        _userChanged,
        addGroups,
        addRoles,
        addEntitlements,
      ) => {
        const errors: string[] = [];
        const queue = new PQueue({ concurrency: API_CONCURRENCY });
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
              await queue.add(async () => {
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
                  errors.push(Label.GROUPS_ERROR);
                }
              });
            }
            if (addRoles.length) {
              await queue.add(async () => {
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
                  errors.push(Label.ROLES_ERROR);
                }
              });
            }
            if (addEntitlements.length) {
              await queue.add(async () => {
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
                  errors.push(Label.ENTITLEMENTS_ERROR);
                }
              });
            }
          } else {
            errors.push(Label.IDENTITY_ID_ERROR);
          }
        } catch {
          // These errors are handled by the errors returned by `usePostIdentities`.
          return;
        }
        void queue.onIdle().then(() => {
          void queryClient.invalidateQueries({
            queryKey: [Endpoint.IDENTITIES],
          });
          close();
          errors.forEach((error) => {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="negative">
                {error}
              </ToastCard>
            ));
          });
          if (!postIdentitiesError) {
            reactHotToast.custom((t) => (
              <ToastCard toastInstance={t} type="positive">
                {`User with email "${email}" was created.`}
              </ToastCard>
            ));
          }
        });
      }}
    />
  );
};

export default AddUserPanel;
