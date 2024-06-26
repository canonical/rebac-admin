import { Button } from "@canonical/react-components";
import { screen } from "@testing-library/react";
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
  await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
  expect(screen.getByText(content)).toBeInTheDocument();
  const container = document.getElementById(containerId)?.firstChild;
  expect(container).toHaveClass("l-aside");
  expect(container).toHaveAttribute("role", "complementary");
});

test("can remove a portal", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
  expect(screen.getByText(content)).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
  expect(screen.queryByText(content)).not.toBeInTheDocument();
  let container = document.getElementById(containerId)?.firstChild;
  expect(container).not.toHaveClass("l-aside");
  expect(container).not.toHaveAttribute("role");
});

test("can add and remove additional classes", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent classes="extra-class" />
    </ReBACAdminContext.Provider>,
  );
  const toggle = screen.getByRole("button", { name: "Toggle" });
  await userEvent.click(toggle);
  expect(document.getElementById(containerId)?.firstChild).toHaveClass(
    "extra-class",
  );
  await userEvent.click(toggle);
  expect(document.getElementById(containerId)?.firstChild).not.toHaveClass(
    "extra-class",
  );
});

test("should not close portal when clicking esc", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
  expect(screen.getByText(content)).toBeInTheDocument();
  const container = document.getElementById(containerId)?.firstChild;
  expect(container).toHaveClass("l-aside");
  await userEvent.keyboard("{Escape}");
  expect(container).toHaveClass("l-aside");
});

test("should not close portal when clicking outside the panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
  expect(screen.getByText(content)).toBeInTheDocument();
  const container = document.getElementById(containerId)?.firstChild;
  expect(container).toHaveClass("l-aside");
  await userEvent.click(document.body);
  expect(container).toHaveClass("l-aside");
});
