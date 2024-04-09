import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { ReBACAdminContext } from "context/ReBACAdminContext";
import { hasNotification, renderComponent } from "test/utils";

import PanelForm from "./PanelForm";
import { Label } from "./types";

test("can display contents", async () => {
  renderComponent(
    <PanelForm<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
    >
      Form content
    </PanelForm>,
  );
  expect(screen.getByText("Form content")).toBeInTheDocument();
});

test("can display add state", async () => {
  renderComponent(
    <PanelForm<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
    >
      Form content
    </PanelForm>,
  );
  expect(
    screen.getByRole("heading", { name: "Create role" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Create role" }),
  ).toBeInTheDocument();
});

test("can display edit state", async () => {
  renderComponent(
    <PanelForm<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      isEditing
      onSubmit={vi.fn()}
    >
      Form content
    </PanelForm>,
  );
  expect(
    screen.getByRole("heading", { name: "Edit role" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Update role" }),
  ).toBeInTheDocument();
});

// eslint-disable-next-line vitest/expect-expect
test("can display errors", async () => {
  renderComponent(
    <PanelForm<{ name: string }>
      close={vi.fn()}
      entity="role"
      error="Uh oh!"
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
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
      entity="role"
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
    >
      Form content
    </PanelForm>,
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: Label.CANCEL })),
  );
  expect(close).toHaveBeenCalled();
});

test("can submit the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <div id="aside-panel"></div>
      <PanelForm<{ name: string }>
        close={vi.fn()}
        entity="role"
        initialValues={{ name: "" }}
        onSubmit={onSubmit}
      >
        Form content
      </PanelForm>
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create role" }),
      ),
  );
  expect(onSubmit).toHaveBeenCalled();
});
