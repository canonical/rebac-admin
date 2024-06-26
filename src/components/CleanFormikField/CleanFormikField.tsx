import { FormikField } from "@canonical/react-components";
import { useFormikContext } from "formik";

import { type Props } from "./types";

const CleanFormikField = ({ ...props }: Props) => {
  const { dirty } = useFormikContext();
  return <FormikField {...props} displayError={dirty} />;
};

export default CleanFormikField;
