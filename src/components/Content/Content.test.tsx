import { screen } from "@testing-library/react";

import { renderComponent } from "test/utils";

import Content from "./Content";

test("should render content correctly", async () => {
  const title = "Mock content title";
  const content = "This is the content!";
  renderComponent(
    <Content title={title}>
      <p>{content}</p>
    </Content>,
  );
  expect(screen.getByText(title)).toBeInTheDocument();
  expect((await screen.findByText(content)).closest("div")).toHaveClass(
    "l-content",
  );
});
