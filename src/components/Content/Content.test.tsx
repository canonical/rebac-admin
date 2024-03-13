import { screen } from "@testing-library/react";

import { renderComponent } from "test/utils";

import Content from "./Content";

test("should display content", () => {
  const content = "This is the content!";
  renderComponent(
    <Content>
      <p>{content}</p>
    </Content>,
  );
  expect(screen.getByText(content).closest("div")).toHaveClass("l-content");
});
