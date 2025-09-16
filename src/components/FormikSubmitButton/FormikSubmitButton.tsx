import { ActionButton } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { Props } from "./types";

const FormikSubmitButton = ({
  appearance = "positive",
  enabled,
  disabled,
  ...props
}: Props) => {
  const { dirty, isValid } = useFormikContext();
  return (
    <ActionButton
      {...props}
      appearance={appearance}
      disabled={enabled === true ? false : disabled || !isValid || !dirty}
      type="submit"
    />
  );
};

export default FormikSubmitButton;
