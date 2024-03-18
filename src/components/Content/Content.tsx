import type { ReactNode } from "react";
import { type JSX } from "react";

import CheckCapability from "components/CheckCapability";
import Panel from "components/Panel";
import { CapabilityAction } from "hooks/capabilities";
import type { Endpoint } from "types/api";

import "./_content.scss";

type Props = {
  children: JSX.Element;
  title: ReactNode;
  endpoint: Endpoint;
};

const Content = ({ children, title, endpoint }: Props): JSX.Element => (
  <Panel title={title}>
    <div className="l-content">
      <CheckCapability endpoint={endpoint} action={CapabilityAction.READ}>
        {children}
      </CheckCapability>
    </div>
  </Panel>
);

export default Content;
