import type { PanelProps } from "@canonical/react-components";
import type { FormikValues } from "formik";

import type { Props as PanelFormProps } from "components/PanelForm";

export type Props<F extends FormikValues> = {
  title: PanelProps["title"];
} & PanelFormProps<F>;
