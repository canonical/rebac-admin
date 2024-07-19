import type { Input, FormikFieldProps } from "@canonical/react-components";
import { FormikField } from "@canonical/react-components";
import { useFormikContext } from "formik";
import type { ComponentType, ElementType } from "react";

const CleanFormikField = <
  C extends ElementType | ComponentType = typeof Input,
>({
  ...props
}: FormikFieldProps<C>) => {
  const { dirty } = useFormikContext();
  return (
    <FormikField<C> {...props} displayError={props.displayError ?? dirty} />
  );
};

export default CleanFormikField;
