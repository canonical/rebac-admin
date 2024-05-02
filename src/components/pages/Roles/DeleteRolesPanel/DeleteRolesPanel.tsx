import { Col, Row, Icon, FormikField } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";
import * as Yup from "yup";

import { useDeleteRolesId } from "api/roles-id/roles-id";
import FormPanel from "components/FormPanel";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import type { FormFields } from "./types";
import { Label, type Props } from "./types";

import "./_delete-roles-panel.scss";

const DeleteRolePanel = ({ roles, close }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteRolesId, isPending: isDeleteRolesIdPending } =
    useDeleteRolesId();
  const rolesCount = `${roles.length} role${roles.length !== 1 ? "s" : ""}`;
  const confirmationMessage = `remove ${rolesCount}`;

  const schema = Yup.object().shape({
    confirmationMessage: Yup.string().oneOf(
      [confirmationMessage],
      Label.CONFIRMATION_MESSAGE_ERROR,
    ),
  });

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
    <FormPanel<FormFields>
      title={
        <span className="p-heading--4 panel-form-navigation__current-title">
          Delete {rolesCount}
        </span>
      }
      close={close}
      submitLabel={
        <div className="delete-roles-button">
          <Icon name="delete" className="is-light" />
          <span className="delete-roles-button__label">{Label.DELETE}</span>
        </div>
      }
      validationSchema={schema}
      isSaving={isDeleteRolesIdPending}
      onSubmit={handleDeleteRoles}
      initialValues={{ message: "" }}
      submitButtonAppearance="negative"
    >
      <Row>
        <Col size={12}>
          <p>
            Are you sure you want to delete {rolesCount}?<br />
            The deletion of roles is irreversible and might adversely affect
            your system.
          </p>
        </Col>
        <Col size={12}>
          <FormikField
            label={
              <Col size={12}>
                Type <b>{confirmationMessage}</b> to confirm.
              </Col>
            }
            name="confirmationMessage"
            type="text"
            takeFocus
          />
        </Col>
      </Row>
    </FormPanel>
  );
};

export default DeleteRolePanel;
