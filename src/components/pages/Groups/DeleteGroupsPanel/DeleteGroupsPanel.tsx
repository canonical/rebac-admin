import { Col, Row, FormikField, Icon } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import Limiter from "async-limiter";
import reactHotToast from "react-hot-toast";
import * as Yup from "yup";

import { useDeleteGroupsId } from "api/groups-id/groups-id";
import FormPanel from "components/FormPanel";
import ToastCard from "components/ToastCard";
import { API_CONCURRENCY } from "consts";
import { Endpoint } from "types/api";

import type { Props, FormFields } from "./types";
import { Label } from "./types";

import "./_delete-groups-panel.scss";

const DeleteGroupPanel = ({ groups, close }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteGroupsId, isPending: isDeleteGroupsIdPending } =
    useDeleteGroupsId();
  const groupsCount = `${groups.length} group${groups.length !== 1 ? "s" : ""}`;
  const confirmationMessage = `remove ${groupsCount}`;

  const schema = Yup.object().shape({
    confirmationMessage: Yup.string().oneOf(
      [confirmationMessage],
      Label.CONFIRMATION_MESSAGE_ERROR,
    ),
  });

  const handleDeleteGroups = async () => {
    let hasError = false;
    const queue = new Limiter({ concurrency: API_CONCURRENCY });
    groups.forEach((id) => {
      queue.push(async (done) => {
        try {
          await deleteGroupsId({
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
        queryKey: [Endpoint.GROUPS],
      });
      close();
      if (hasError) {
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="negative">
            Some groups couldn't be deleted
          </ToastCard>
        ));
      } else {
        reactHotToast.custom((t) => (
          <ToastCard toastInstance={t} type="positive">
            Selected groups have been deleted
          </ToastCard>
        ));
      }
    });
  };

  return (
    <FormPanel<FormFields>
      title={
        <span className="p-heading--4 panel-form-navigation__current-title">
          Delete {groupsCount}
        </span>
      }
      close={close}
      submitLabel={
        <div className="delete-groups-button">
          <Icon name="delete" className="is-light" />
          <span className="delete-roles-button__label">{Label.DELETE}</span>
        </div>
      }
      validationSchema={schema}
      isSaving={isDeleteGroupsIdPending}
      onSubmit={handleDeleteGroups}
      initialValues={{ message: "" }}
      submitButtonAppearance="negative"
    >
      <Row>
        <Col size={12}>
          <p>
            Are you sure you want to delete {groupsCount}?<br />
            The deletion of groups is irreversible and might adversely affect
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

export default DeleteGroupPanel;
