import { List } from "@canonical/react-components";

import type { Props } from "./types";

import "./_list-card-list.scss";

const ListCardList = ({ title, items }: Props) => {
  return (
    <>
      <h5 className="list-card-list__title u-no-margin--bottom">{title}</h5>
      <List
        divided
        items={items.map(({ label, value }) => ({
          className: "list-card-list__row",
          content: (
            <>
              <span className="list-card-list__col u-text--muted">{label}</span>
              <span className="list-card-list__col">{value || "-"}</span>
            </>
          ),
        }))}
      />
    </>
  );
};

export default ListCardList;
