import { ActionButton } from "@canonical/react-components";
import { useFormikContext } from "formik";

import { type Props } from "./types";

const FormikSubmitButton = ({
  appearance = "positive",
  disabled,
  ...props
}: Props) => {
  const { dirty, isValid } = useFormikContext();
  return (
    <ActionButton
      {...props}
      appearance={appearance}
      disabled={disabled || !isValid || !dirty}
      type="submit"
    />
  );
};

export default FormikSubmitButton;
