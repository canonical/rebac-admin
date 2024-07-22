import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { ReBACAdminContext } from "context/ReBACAdminContext";
import { PanelWidth } from "hooks/usePanel";
import { renderComponent } from "test/utils";

import SubFormPanel from "./SubFormPanel";
import { TestId } from "./types";

test("can display the loading state", async () => {
  renderComponent(
    <SubFormPanel<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      isFetching
      onSubmit={vi.fn()}
      setPanelWidth={vi.fn()}
      subForms={[]}
    >
      Form content
    </SubFormPanel>,
  );
  expect(screen.getByText("Loading role")).toBeInTheDocument();
  expect(screen.queryByText("Form content")).not.toBeInTheDocument();
});

test("can display contents", async () => {
  renderComponent(
    <SubFormPanel<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      onSubmit={vi.fn()}
      setPanelWidth={vi.fn()}
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
      setPanelWidth={vi.fn()}
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
      setPanelWidth={vi.fn()}
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

test("the initial width is set", async () => {
  const setPanelWidth = vi.fn();
  renderComponent(
    <SubFormPanel<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      isEditing
      onSubmit={vi.fn()}
      panelWidth={PanelWidth.WIDE}
      setPanelWidth={setPanelWidth}
      subForms={[]}
    >
      Form content
    </SubFormPanel>,
  );
  expect(screen.getByTestId(TestId.DEFAULT_VIEW)).toBeInTheDocument();
  expect(setPanelWidth).toHaveBeenCalledWith(PanelWidth.WIDE);
});

test("a default width is set", async () => {
  const setPanelWidth = vi.fn();
  renderComponent(
    <SubFormPanel<{ name: string }>
      close={vi.fn()}
      entity="role"
      initialValues={{ name: "" }}
      isEditing
      onSubmit={vi.fn()}
      setPanelWidth={setPanelWidth}
      subForms={[]}
    >
      Form content
    </SubFormPanel>,
  );
  expect(screen.getByTestId(TestId.DEFAULT_VIEW)).toBeInTheDocument();
  expect(setPanelWidth).toHaveBeenCalledWith(PanelWidth.MEDIUM);
});

test("can display a subform", async () => {
  const setPanelWidth = vi.fn();
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <div id="aside-panel"></div>
      <SubFormPanel<{ name: string }>
        close={vi.fn()}
        entity="role"
        initialValues={{ name: "" }}
        onSubmit={vi.fn()}
        setPanelWidth={setPanelWidth}
        subForms={[
          {
            count: 4,
            entity: "entitlement",
            icon: "user",
            panelWidth: PanelWidth.NARROW,
            view: <div data-testid="subform" />,
          },
        ]}
      >
        Form content
      </SubFormPanel>
    </ReBACAdminContext.Provider>,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  expect(screen.getByTestId("subform")).toBeInTheDocument();
  expect(screen.getByTestId(TestId.DEFAULT_VIEW)).toHaveClass("u-hide");
  expect(setPanelWidth).toHaveBeenCalledWith(PanelWidth.NARROW);
});

test("uses the parent width if not set", async () => {
  const setPanelWidth = vi.fn();
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: "aside-panel" }}>
      <div id="aside-panel"></div>
      <SubFormPanel<{ name: string }>
        close={vi.fn()}
        entity="role"
        initialValues={{ name: "" }}
        onSubmit={vi.fn()}
        panelWidth={PanelWidth.WIDE}
        setPanelWidth={setPanelWidth}
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
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  expect(setPanelWidth).toHaveBeenCalledWith(PanelWidth.WIDE);
});
