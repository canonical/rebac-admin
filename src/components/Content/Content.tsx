import { Panel } from "@canonical/react-components";
import type { PropsWithChildren, ReactNode } from "react";
import { type JSX } from "react";

import CheckCapability from "components/CheckCapability";
import { CapabilityAction } from "hooks/capabilities";
import type { Endpoint } from "types/api";

import "./_content.scss";

type Props = {
  controls?: ReactNode;
  endpoint: Endpoint;
  title: ReactNode;
} & PropsWithChildren;

const Content = ({
  children,
  controls,
  title,
  endpoint,
}: Props): JSX.Element => (
  <Panel controls={controls} title={title}>
    <div className="l-content">
      <CheckCapability endpoint={endpoint} action={CapabilityAction.READ}>
        {children}
      </CheckCapability>
    </div>
  </Panel>
);

export default Content;
