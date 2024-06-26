import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import CleanFormikField from "components/CleanFormikField";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import { hasNotification, renderComponent } from "test/utils";

import PanelForm from "./PanelForm";
import { Label } from "./types";

test("can display contents", async () => {
  renderComponent(
    <PanelForm<{ name: string }>
      close={vi.fn()}
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
      submitLabel="Submit!"
    >
      Form content
    </PanelForm>,
  );
  expect(screen.getByText("Form content")).toBeInTheDocument();
});

// eslint-disable-next-line vitest/expect-expect
test("can display errors", async () => {
  renderComponent(
    <PanelForm<{ name: string }>
      close={vi.fn()}
      error="Uh oh!"
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
      submitLabel="Submit!"
    >
      Form content
    </PanelForm>,
  );
  await hasNotification("Uh oh!");
});

test("can cancel", async () => {
  const close = vi.fn();
  renderComponent(
    <PanelForm<{ name: string }>
      close={close}
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
      submitLabel="Submit!"
    >
      Form content
    </PanelForm>,
  );
  await userEvent.click(screen.getByRole("button", { name: Label.CANCEL }));
  expect(close).toHaveBeenCalled();
});

test("can submit the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <div id="aside-panel"></div>
      <PanelForm<{ name: string }>
        close={vi.fn()}
        initialValues={{ name: "" }}
        onSubmit={onSubmit}
        submitLabel="Submit!"
      >
        <CleanFormikField label="name" name="name" type="text" />
      </PanelForm>
    </ReBACAdminContext.Provider>,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "name" }),
    "editors",
  );
  await userEvent.click(screen.getByRole("button", { name: "Submit!" }));
  expect(onSubmit).toHaveBeenCalled();
});
