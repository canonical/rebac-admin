import { type JSX } from "react";

import "./_content.scss";

type Props = {
  children: JSX.Element;
};

const Content = ({ children }: Props): JSX.Element => (
  <div className="l-content">{children}</div>
);

export default Content;
