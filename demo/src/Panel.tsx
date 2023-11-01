import type { PropsWithChildren } from "react";

type Props = {
  title: string;
} & PropsWithChildren;

const Panel = ({ children, title }: Props) => (
  <div className="p-panel">
    <div className="p-panel__header">
      <h4 className="p-panel__title">{title}</h4>
    </div>
    <div className="p-panel__content">
      <div className="u-fixed-width">{children}</div>
    </div>
  </div>
);

export default Panel;
