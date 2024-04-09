import { FormikField } from "@canonical/react-components";

import PanelForm from "components/PanelForm";

import type { FormFields } from "./types";
import { Label, type Props } from "./types";

const RolePanel = ({ close, error, roleId, onSubmit, isSaving }: Props) => {
  const isEditing = !!roleId;
  return (
    <PanelForm<FormFields>
      close={close}
      entity="role"
      error={error}
      initialValues={{ id: "" }}
      isSaving={isSaving}
      onSubmit={onSubmit}
    >
      <FormikField
        label={Label.NAME}
        name="id"
        takeFocus={!isEditing}
        type="text"
      />
    </PanelForm>
  );
};

export default RolePanel;
