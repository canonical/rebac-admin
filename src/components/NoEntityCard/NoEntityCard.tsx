import { EmptyState, Icon } from "@canonical/react-components";

import type { Props } from "./types";

import "./_no-entity-card.scss";

const NoEntityCard = ({ title, message, actionButton }: Props) => (
  <div className="no-entity-card">
    <Icon name="plans" className="no-entity-card__icon" />
    <EmptyState image={null} title={title}>
      <p className="u-no-padding--top">{message}</p>
      {actionButton}
    </EmptyState>
  </div>
);

export default NoEntityCard;
