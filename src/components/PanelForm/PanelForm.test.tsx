import { FormikField } from "@canonical/react-components";
import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { ReBACAdminContext } from "context/ReBACAdminContext";
import { hasNotification, renderComponent } from "test/utils";

import PanelForm from "./PanelForm";
import { Label, TestId } from "./types";

test("can display contents", async () => {
  renderComponent(
    <PanelForm<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
      subForms={[]}
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
      subForms={[]}
    >
      Form content
    </PanelForm>,
  );
  expect(screen.getByTestId(TestId.DEFAULT_VIEW)).toBeInTheDocument();
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
      subForms={[]}
    >
      Form content
    </PanelForm>,
  );
  expect(screen.getByTestId(TestId.DEFAULT_VIEW)).toBeInTheDocument();
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
      subForms={[]}
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
      subForms={[]}
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
        subForms={[]}
      >
        <FormikField label="name" name="name" type="text" />
      </PanelForm>
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: "name" }),
        "editors",
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Create role" }),
      ),
  );
  expect(onSubmit).toHaveBeenCalled();
});

test("can display a subform", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <div id="aside-panel"></div>
      <PanelForm<{ name: string }>
        close={vi.fn()}
        entity="role"
        initialValues={{ name: "" }}
        onSubmit={vi.fn()}
        subForms={[
          {
            count: 4,
            entity: "entitlement",
            icon: "user",
            view: <div data-testid="subform" />,
          },
        ]}
      >
        Form content
      </PanelForm>
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: /Add entitlements/ }),
      ),
  );
  expect(screen.getByTestId("subform")).toBeInTheDocument();
  expect(screen.getByTestId(TestId.DEFAULT_VIEW)).toHaveClass("u-hide");
});
