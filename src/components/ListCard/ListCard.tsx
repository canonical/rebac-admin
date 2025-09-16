import { Card, Col, Row } from "@canonical/react-components";
import type { FC } from "react";

import ListCardList from "./ListCardList";
import type { Props } from "./types";

const ListCard: FC<Props> = ({ lists, title }: Props) => {
  return (
    <Row>
      <Col size={4}>
        <Card className="list-card">
          <h4 className="list-card-title p-heading--5 p-text--small u-text--muted">
            {title}
          </h4>
          {lists.map((list, i) => (
            <ListCardList key={i} {...list} />
          ))}
        </Card>
      </Col>
    </Row>
  );
};

export default ListCard;
