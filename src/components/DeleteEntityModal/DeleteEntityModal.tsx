import { Icon, ConfirmationModal } from "@canonical/react-components";
import { Form, Formik } from "formik";
import type { FC } from "react";
import { useId, useState } from "react";
import * as Yup from "yup";

import Fields from "./Fields";
import type { Props, FormFields } from "./types";
import { Label } from "./types";

const DeleteEntityModal: FC<Props> = ({
  entity,
  count,
  close,
  onDelete,
  isDeletePending,
}: Props) => {
  const formId = useId();
  const entityCount = `${count} ${entity}${count !== 1 ? "s" : ""}`;
  const confirmationMessage = `delete ${entityCount}`;
  const [isValid, setIsValid] = useState(false);

  const schema = Yup.object().shape({
    confirmationMessage: Yup.string()
      .oneOf([confirmationMessage], Label.CONFIRMATION_MESSAGE_ERROR)
      .required("Confirmation message is required."),
  });

  return (
    <ConfirmationModal
      title={
        <span className="p-heading--4 panel-form-navigation__current-title">
          Delete {entityCount}
        </span>
      }
      close={close}
      confirmButtonLabel={
        <>
          <Icon name="delete" className="is-light" /> {Label.DELETE}
        </>
      }
      confirmButtonDisabled={!isValid}
      confirmButtonLoading={isDeletePending}
      confirmButtonProps={{
        type: "submit",
        form: formId,
      }}
      onConfirm={() => {
        // This is handled by the form onSubmit.
      }}
      confirmButtonAppearance="negative"
    >
      <Formik<FormFields>
        initialValues={{ confirmationMessage: "" }}
        onSubmit={onDelete}
        validationSchema={schema}
      >
        <Form id={formId}>
          <Fields
            confirmationMessage={confirmationMessage}
            entity={entity}
            entityCount={entityCount}
            setIsValid={setIsValid}
          />
        </Form>
      </Formik>
    </ConfirmationModal>
  );
};

export default DeleteEntityModal;
