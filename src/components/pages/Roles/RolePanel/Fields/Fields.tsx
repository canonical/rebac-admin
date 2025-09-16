import { useFormikContext } from "formik";
import type { FC } from "react";
import { useEffect } from "react";

import CleanFormikField from "components/CleanFormikField";

import { FieldName, Label, type Props } from "./types";

const Fields: FC<Props> = ({ setIsDirty }: Props) => {
  const { dirty } = useFormikContext();

  useEffect(() => {
    setIsDirty(dirty);
  }, [setIsDirty, dirty]);

  return (
    <CleanFormikField
      label={Label.NAME}
      name={FieldName.NAME}
      takeFocus
      type="text"
    />
  );
};

export default Fields;
