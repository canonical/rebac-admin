import { screen, within } from "@testing-library/react";

import { renderComponent } from "test/utils";

import ListCardList from "./ListCardList";

test("displays the title", async () => {
  const title = "list title";
  renderComponent(<ListCardList title={title} items={[]} />);
  expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
});

test("displays items", async () => {
  renderComponent(
    <ListCardList title="" items={[{ label: "username", value: "joe" }]} />,
  );
  const listitem = screen.getByRole("listitem");
  expect(within(listitem).getByText("username")).toBeInTheDocument();
  expect(within(listitem).getByText("joe")).toBeInTheDocument();
});
