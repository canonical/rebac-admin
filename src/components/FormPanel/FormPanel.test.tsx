import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import FormPanel from "./FormPanel";

test("displays a form", async () => {
  renderComponent(
    <FormPanel<{ name: string }>
      close={vi.fn()}
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
      submitLabel="Submit!"
      title="panel title"
    >
      Form content
    </FormPanel>,
  );
  expect(screen.getByText("panel title")).toBeInTheDocument();
  expect(screen.getByText("Form content")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Submit!" })).toBeInTheDocument();
});
