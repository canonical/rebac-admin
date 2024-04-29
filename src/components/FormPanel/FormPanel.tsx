import type { FormikValues } from "formik";

import EmbeddedPanel from "components/EmbeddedPanel";
import { EmbeddedPanelLabelledById } from "components/EmbeddedPanel/consts";
import PanelForm from "components/PanelForm";

import { type Props } from "./types";

const FormPanel = <F extends FormikValues>({ title, ...props }: Props<F>) => {
  return (
    <EmbeddedPanel title={title} titleId={EmbeddedPanelLabelledById}>
      <PanelForm<F> {...props} />
    </EmbeddedPanel>
  );
};

export default FormPanel;
