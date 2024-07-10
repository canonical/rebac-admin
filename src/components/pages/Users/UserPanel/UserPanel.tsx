import * as Yup from "yup";

import CleanFormikField from "components/CleanFormikField";
import SubFormPanel from "components/SubFormPanel";
import { PanelWidth } from "hooks/usePanel";

import { FieldName, Label } from "./types";
import type { FormFields, Props } from "./types";

const schema = Yup.object().shape({
  [FieldName.EMAIL]: Yup.string().required("Required"),
});

const UserPanel = ({ onSubmit, isSaving, ...props }: Props) => {
  return (
    <SubFormPanel<FormFields>
      {...props}
      entity="local user"
      initialValues={{
        email: "",
        firstName: "",
        lastName: "",
      }}
      onSubmit={async (values) => await onSubmit(values)}
      panelWidth={PanelWidth.MEDIUM}
      subForms={[]}
      validationSchema={schema}
    >
      <h5>Personal details</h5>
      <CleanFormikField
        label={Label.EMAIL}
        name={FieldName.EMAIL}
        takeFocus={true}
        type="email"
      />
      <CleanFormikField
        label={Label.FIRST_NAME}
        name={FieldName.FIRST_NAME}
        type="text"
      />
      <CleanFormikField
        label={Label.LAST_NAME}
        name={FieldName.LAST_NAME}
        type="text"
      />
    </SubFormPanel>
  );
};

export default UserPanel;
