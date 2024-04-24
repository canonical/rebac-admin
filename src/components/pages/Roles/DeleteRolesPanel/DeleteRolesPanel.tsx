import {
  Col,
  Row,
  Button,
  ButtonAppearance,
  ActionButton,
  Input,
  Icon,
} from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import { useState } from "react";
import reactHotToast from "react-hot-toast";

import { useDeleteRolesId } from "api/roles-id/roles-id";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import { Label, type Props } from "./types";

import "./_delete-roles-panel.scss";

const AddRolePanel = ({ roles, close }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteRolesId, isPending: isDeleteRolesIdPending } =
    useDeleteRolesId();
  const [confirmationInput, setConfirmationInput] = useState("");
  const rolesCount = `${roles.length} role${roles.length !== 1 ? "s" : ""}`;

  const handleDeleteRoles = async () => {
    let hasError = false;
    const queue = new Limiter({ concurrency: API_CONCURRENCY });
    roles.forEach((id) => {
      queue.push(async (done) => {
        try {
          await deleteRolesId({
            id,
          });
        } catch (error) {
          hasError = true;
        }
        done();
      });
    });
    queue.onDone(() => {
      void queryClient.invalidateQueries({
        queryKey: [Endpoint.ROLES],
      });
      close();
      if (hasError) {
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="negative">
            Some roles couldn't be deleted
          </ToastCard>
        ));
      } else {
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="positive">
            Selected roles have been deleted
          </ToastCard>
        ));
      }
    });
  };

  return (
    <>
      <div className="p-panel__header">
        <div className="p-panel__title">
          <span className="p-heading--4 panel-form-navigation__current-title">
            Delete {rolesCount}
          </span>
        </div>
      </div>
      <div className="p-panel__content">
        <Row>
          <Col size={12}>Are you sure you want to delete {rolesCount}?</Col>
          <Col size={12}>
            The deletion of groups is irreversible and might adversely affect
            your system.
          </Col>
          <Col size={12}>
            <br />
          </Col>
          <Col size={12}>
            Type <b>remove {rolesCount}</b> to confirm.
          </Col>
          <Col size={12}>
            <Input
              type="text"
              value={confirmationInput}
              onChange={(event) => setConfirmationInput(event.target.value)}
            />
          </Col>
          <Col size={12}>
            <hr />
          </Col>
        </Row>
        <Row className="u-align--right">
          <Col size={12}>
            <Button
              appearance={ButtonAppearance.BASE}
              onClick={close}
              type="button"
            >
              {Label.CANCEL}
            </Button>
            <ActionButton
              appearance={ButtonAppearance.NEGATIVE}
              disabled={confirmationInput !== `remove ${rolesCount}`}
              loading={isDeleteRolesIdPending}
              onClick={() => void handleDeleteRoles()}
              type="button"
              className="delete-roles-button"
            >
              <Icon name="delete" className="is-light" />
              <span className="delete-roles-button__label">{Label.DELETE}</span>
            </ActionButton>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AddRolePanel;
