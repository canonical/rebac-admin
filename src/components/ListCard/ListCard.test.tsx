import { screen } from "@testing-library/react";

import { renderComponent } from "test/utils";

import ListCard from "./ListCard";

test("displays the title", async () => {
  const title = "card title";
  renderComponent(<ListCard title={title} lists={[]} />);
  expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
});

test("displays multiple lists", async () => {
  renderComponent(
    <ListCard
      title=""
      lists={[
        { title: "list1 title", items: [] },
        { title: "list2 title", items: [] },
      ]}
    />,
  );
  expect(
    screen.getByRole("heading", { name: "list1 title" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "list2 title" }),
  ).toBeInTheDocument();
});
