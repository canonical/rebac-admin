import { useFormikContext } from "formik";
import { useEffect } from "react";

import CleanFormikField from "components/CleanFormikField";

import type { Props } from "./types";
import { FieldName, Label } from "./types";

const Fields = ({ setIsDirty }: Props) => {
  const { dirty } = useFormikContext();

  useEffect(() => {
    setIsDirty(dirty);
  }, [dirty, setIsDirty]);

  return (
    <>
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
    </>
  );
};

export default Fields;
