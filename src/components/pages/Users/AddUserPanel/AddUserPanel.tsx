import { useQueryClient } from "@tanstack/react-query";
import reactHotToast from "react-hot-toast";

import { usePostIdentities } from "api/identities/identities";
import ToastCard from "components/ToastCard";
import { Endpoint } from "types/api";

import type { UserPanelProps } from "../UserPanel";
import UserPanel from "../UserPanel";

type Props = {
  close: UserPanelProps["close"];
  setPanelWidth: UserPanelProps["setPanelWidth"];
};

const AddUserPanel = ({ close, setPanelWidth }: Props) => {
  const queryClient = useQueryClient();
  const {
    error: postIdentitiesError,
    mutateAsync: postIdentities,
    isPending: isPostIdentitiesPending,
  } = usePostIdentities();

  return (
    <UserPanel
      close={close}
      setPanelWidth={setPanelWidth}
      isSaving={isPostIdentitiesPending}
      error={
        postIdentitiesError
          ? `Unable to create local user: ${postIdentitiesError.response?.data.message}`
          : null
      }
      onSubmit={async ({ email, firstName, lastName }) => {
        try {
          await postIdentities({
            data: {
              email,
              firstName,
              lastName,
              addedBy: "admin",
              source: "local",
            },
          });
        } catch {
          // These errors are handled by the errors returned by `usePostIdentities`.
          return;
        }
        void queryClient.invalidateQueries({
          queryKey: [Endpoint.IDENTITIES],
        });
        close();
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="positive">
            {`User with email "${email}" was created.`}
          </ToastCard>
        ));
      }}
    />
  );
};

export default AddUserPanel;
