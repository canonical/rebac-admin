import type { PropsWithChildren, ReactNode } from "react";
import { type JSX } from "react";

import Panel from "components/Panel";

import "./_content.scss";

type Props = {
  controls?: ReactNode;
  title: ReactNode;
} & PropsWithChildren;

const Content = ({ children, controls, title }: Props): JSX.Element => (
  <Panel controls={controls} title={title}>
    <div className="l-content">{children}</div>
  </Panel>
);

export default Content;
