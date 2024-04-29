import { type Props } from "./types";

const EmbeddedPanel = ({ children, title, titleId }: Props) => {
  // This component does not use the Panel component as Vanilla requires a strict
  // element hierarchy that can't be achieved using the normal components in
  // conjunction with portals.
  return (
    <>
      <div className="p-panel__header">
        <div className="p-panel__title" id={titleId}>
          {title}
        </div>
      </div>
      <div className="p-panel__content">{children}</div>
    </>
  );
};

export default EmbeddedPanel;
