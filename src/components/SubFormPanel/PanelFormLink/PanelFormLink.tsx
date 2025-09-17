import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";

import type { Props } from "./types";
import { generateTitle } from "./utils";

const PanelFormLink: FC<Props> = ({
  count,
  entity,
  icon,
  isEditing,
  onClick,
}: Props) => {
  return (
    <Button
      appearance="base"
      className="panel-form-link"
      onClick={() => {
        onClick(entity);
      }}
      type="button"
    >
      <span className="panel-form-link__column">
        <Icon name={icon} className="panel-form-link__icon" />
        <span className="panel-form-link__title">
          {generateTitle(entity, isEditing)}
        </span>
      </span>
      <span className="panel-form-link__column u-align--right">
        <span className="panel-form-link__count u-text--muted">
          {count === 0
            ? `No ${entity}s`
            : `${count} ${entity}${count > 1 ? "s" : ""}`}
        </span>
        <Icon name="chevron-right" />
      </span>
    </Button>
  );
};

export default PanelFormLink;
