import { Col, Row, FormikField, Icon } from "@canonical/react-components";
import * as Yup from "yup";

import FormPanel from "components/FormPanel";

import type { Props, FormFields } from "./types";
import { Label } from "./types";

import "./_delete-entity-panel.scss";

const DeleteEntityPanel = ({
  entityName,
  entitiesName,
  entities,
  close,
  onDelete,
  isDeletePending,
}: Props) => {
  const entitiesCount = `${entities.length} ${entities.length === 1 ? entityName : entitiesName}`;
  const confirmationMessage = `remove ${entitiesCount}`;

  const schema = Yup.object().shape({
    confirmationMessage: Yup.string().oneOf(
      [confirmationMessage],
      Label.CONFIRMATION_MESSAGE_ERROR,
    ),
  });

  return (
    <FormPanel<FormFields>
      title={
        <span className="p-heading--4 panel-form-navigation__current-title">
          Delete {entitiesCount}
        </span>
      }
      close={close}
      submitLabel={
        <div className="delete-entity-button">
          <Icon name="delete" className="is-light" />
          <span className="delete-roles-button__label">{Label.DELETE}</span>
        </div>
      }
      validationSchema={schema}
      isSaving={isDeletePending}
      onSubmit={onDelete}
      initialValues={{ confirmationMessage: "" }}
      submitButtonAppearance="negative"
    >
      <Row>
        <Col size={12}>
          <p>
            Are you sure you want to delete {entitiesCount}?<br />
            The deletion of {entitiesName} is irreversible and might adversely
            affect your system.
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

export default DeleteEntityPanel;
