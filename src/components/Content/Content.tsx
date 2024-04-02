import type { PropsWithChildren, ReactNode } from "react";
import { type JSX } from "react";

import Panel from "components/Panel";

import "./_content.scss";

type Props = {
  title: ReactNode;
} & PropsWithChildren;

const Content = ({ children, title }: Props): JSX.Element => (
  <Panel title={title}>
    <div className="l-content">{children}</div>
  </Panel>
);

export default Content;
