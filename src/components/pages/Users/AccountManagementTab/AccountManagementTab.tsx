import {
  Button,
  ButtonAppearance,
  Icon,
  ICONS,
  Notification,
} from "@canonical/react-components";
import { useNavigate, useParams } from "react-router-dom";

import type { Identity } from "api/api.schemas";
import { CapabilityAction, useCheckCapability } from "hooks/capabilities";
import { useDeleteModal } from "hooks/useDeleteModal";
import { Endpoint } from "types/api";
import urls from "urls";

import DeleteUsersModal from "../DeleteUsersModal";

import { Label } from "./types";

const AccountManagementTab = () => {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasCapability: canDeleteUser } = useCheckCapability(
    Endpoint.IDENTITY,
    CapabilityAction.DELETE,
  );
  const { generateModal, openModal } = useDeleteModal<
    NonNullable<Identity["id"]>[]
  >((closeModal, identities) => (
    <DeleteUsersModal
      identities={identities}
      close={closeModal}
      onDeleted={() => {
        navigate(`../..${urls.users.index}`);
      }}
    />
  ));

  if (!userId) {
    // Loading states and errors for the user are handled in the parent
    // `User` component.
    return null;
  }
  return canDeleteUser ? (
    <>
      <h5>Delete user</h5>
      <Button
        appearance={ButtonAppearance.NEGATIVE}
        onClick={() => openModal([userId])}
        hasIcon
      >
        <Icon name={ICONS.delete} light /> <span>{Label.DELETE}</span>
      </Button>
      {generateModal()}
    </>
  ) : (
    <Notification severity="caution">{Label.NO_CONTENT}</Notification>
  );
};

export default AccountManagementTab;
