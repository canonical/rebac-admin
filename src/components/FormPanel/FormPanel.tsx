import { Panel } from "@canonical/react-components";
import type { FormikValues } from "formik";

import PanelForm from "components/PanelForm";
import { SidePanelLabelledById } from "consts";

import type { Props } from "./types";

const FormPanel = <F extends FormikValues>({ title, ...props }: Props<F>) => {
  return (
    <Panel title={title} titleId={SidePanelLabelledById}>
      <PanelForm<F> {...props} />
    </Panel>
  );
};

export default FormPanel;
