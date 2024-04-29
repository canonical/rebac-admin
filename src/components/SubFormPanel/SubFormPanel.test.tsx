import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { ReBACAdminContext } from "context/ReBACAdminContext";
import { renderComponent } from "test/utils";

import SubFormPanel from "./SubFormPanel";
import { TestId } from "./types";

test("can display contents", async () => {
  renderComponent(
    <SubFormPanel<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
      subForms={[]}
    >
      Form content
    </SubFormPanel>,
  );
  expect(screen.getByText("Form content")).toBeInTheDocument();
});

test("can display add state", async () => {
  renderComponent(
    <SubFormPanel<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
      subForms={[]}
    >
      Form content
    </SubFormPanel>,
  );
  expect(screen.getByTestId(TestId.DEFAULT_VIEW)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Create role" }),
  ).toBeInTheDocument();
});

test("can display edit state", async () => {
  renderComponent(
    <SubFormPanel<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      isEditing
      onSubmit={vi.fn()}
      subForms={[]}
    >
      Form content
    </SubFormPanel>,
  );
  expect(screen.getByTestId(TestId.DEFAULT_VIEW)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Update role" }),
  ).toBeInTheDocument();
});

test("can display a subform", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <div id="aside-panel"></div>
      <SubFormPanel<{ name: string }>
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
      </SubFormPanel>
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
