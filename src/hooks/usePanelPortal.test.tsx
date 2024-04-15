import { Button } from "@canonical/react-components";
import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReBACAdminContext } from "context/ReBACAdminContext";
import { renderComponent } from "test/utils";

import { usePanelPortal } from "./usePanelPortal";

const content = "This is the content";
const containerId = "portal-container";

const TestComponent = ({ classes }: { classes?: string }) => {
  const { openPortal, closePortal, isOpen, Portal } = usePanelPortal(classes);
  return (
    <>
      <Button onClick={isOpen ? closePortal : openPortal}>Toggle</Button>
      {isOpen ? <Portal>{content}</Portal> : null}
    </>
  );
};

test("displays without a portal", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  expect(screen.queryByText(content)).not.toBeInTheDocument();
  let container = document.getElementById(containerId);
  expect(container).not.toHaveClass("l-aside");
  expect(container?.hasChildNodes()).toBe(false);
});

test("can display a portal", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Toggle" })),
  );
  expect(screen.getByText(content)).toBeInTheDocument();
  const container = document.getElementById(containerId);
  expect(container).toHaveClass("l-aside");
  expect(container?.firstChild).toHaveClass("p-panel");
});

test("can remove a portal", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Toggle" })),
  );
  expect(screen.getByText(content)).toBeInTheDocument();
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Toggle" })),
  );
  expect(screen.queryByText(content)).not.toBeInTheDocument();
  let container = document.getElementById(containerId);
  expect(container).not.toHaveClass("l-aside");
  expect(container?.firstChild).not.toHaveClass("p-panel");
});

test("can add and remove additional classes", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent classes="extra-class" />
    </ReBACAdminContext.Provider>,
  );
  const toggle = screen.getByRole("button", { name: "Toggle" });
  await act(async () => await userEvent.click(toggle));
  expect(document.getElementById(containerId)).toHaveClass("extra-class");
  await act(async () => await userEvent.click(toggle));
  expect(document.getElementById(containerId)).not.toHaveClass("extra-class");
});
