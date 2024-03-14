import type { ReactNode } from "react";
import { type JSX } from "react";

import CheckCapabilityAction from "components/CheckCapabilityAction";
import Panel from "components/Panel";
import { CapabilityActionItem } from "hooks/capabilities";

import "./_content.scss";

type Props = {
  children: JSX.Element;
  title: ReactNode;
  endpoint: string;
};

const Content = ({ children, title, endpoint }: Props): JSX.Element => (
  <Panel title={title}>
    <div className="l-content">
      <CheckCapabilityAction
        endpoint={endpoint}
        action={CapabilityActionItem.LIST}
      >
        {children}
      </CheckCapabilityAction>
    </div>
  </Panel>
);

export default Content;
