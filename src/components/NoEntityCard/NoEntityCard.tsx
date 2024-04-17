import { EmptyState, Icon } from "@canonical/react-components";

import type { Props } from "./types";

import "./_no-entity-card.scss";

const NoEntityCard = ({ title, message, actionButton }: Props) => (
  <EmptyState
    image={<Icon name="plans" className="no-entity-card__icon u-hide--small" />}
    title={title}
    className="no-entity-card"
    data-testid="no-entity-card"
  >
    <p className="u-no-padding--top">{message}</p>
    {actionButton}
  </EmptyState>
);

export default NoEntityCard;
