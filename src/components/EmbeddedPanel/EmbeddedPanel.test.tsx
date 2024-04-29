import { screen } from "@testing-library/react";

import { renderComponent } from "test/utils";

import EmbeddedPanel from "./EmbeddedPanel";

test("can display contents", async () => {
  renderComponent(
    <EmbeddedPanel title="Panel title">Panel content</EmbeddedPanel>,
  );
  expect(screen.getByText("Panel title")).toBeInTheDocument();
  expect(screen.getByText("Panel content")).toBeInTheDocument();
});
