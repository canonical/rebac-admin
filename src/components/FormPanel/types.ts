import type { FormikValues } from "formik";

import type { PanelProps } from "components/Panel";
import type { Props as PanelFormProps } from "components/PanelForm";

export type Props<F extends FormikValues> = {
  title: PanelProps["title"];
} & PanelFormProps<F>;
