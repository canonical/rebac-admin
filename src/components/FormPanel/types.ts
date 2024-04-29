import type { FormikValues } from "formik";

import type { Props as EmbeddedPanelProps } from "components/EmbeddedPanel";
import type { Props as PanelFormProps } from "components/PanelForm";

export type Props<F extends FormikValues> = {
  title: EmbeddedPanelProps["title"];
} & PanelFormProps<F>;
