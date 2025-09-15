import { EmptyState, Icon } from "@canonical/react-components";

import { TestId, type Props } from "./types";

const NoEntityCard = ({ title, message, actionButton }: Props) => (
  <EmptyState
    image={<Icon name="plans" className="no-entity-card__icon u-hide--small" />}
    title={title}
    className="no-entity-card"
    data-testid={TestId.NO_ENTITY_CARD}
  >
    <p>{message}</p>
    {actionButton}
  </EmptyState>
);

export default NoEntityCard;
