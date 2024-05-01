import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReBACAdminContext } from "context/ReBACAdminContext";
import { renderComponent } from "test/utils";

import { PanelWidth, usePanel } from "./usePanel";

const containerId = "portal-container";

const TestComponent = () => {
  const { generatePanel, openPanel, closePanel } = usePanel<{
    state?: string | null;
  }>((closePanel, data, setPanelWidth) => (
    <div data-testid="panel">
      <button onClick={closePanel}>Exit</button>
      <button
        onClick={() => {
          setPanelWidth(PanelWidth.NARROW);
        }}
      >
        Change width
      </button>
      {data?.state}
    </div>
  ));
  return (
    <>
      <button onClick={() => openPanel({ state: "panel state" })}>Open</button>
      <button onClick={() => closePanel()}>Close</button>
      {generatePanel()}
    </>
  );
};

test("opens the panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  expect(screen.queryByTestId("panel")).not.toBeInTheDocument();
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Open" })),
  );
  expect(screen.getByTestId("panel")).toBeInTheDocument();
});

test("sets the panel width", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Open" })),
  );
  expect(document.getElementById(containerId)).not.toHaveClass("is-narrow");
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: "Change width" }),
      ),
  );
  expect(document.getElementById(containerId)).toHaveClass("is-narrow");
});

test("closes the panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Open" })),
  );
  expect(screen.getByTestId("panel")).toBeInTheDocument();
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Close" })),
  );
  expect(screen.queryByTestId("panel")).not.toBeInTheDocument();
});

test("closes via the panel", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Open" })),
  );
  expect(screen.getByTestId("panel")).toBeInTheDocument();
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Exit" })),
  );
  expect(screen.queryByTestId("panel")).not.toBeInTheDocument();
});

test("displays data", async () => {
  renderComponent(
    <ReBACAdminContext.Provider value={{ asidePanelId: containerId }}>
      <div id={containerId}></div>
      <TestComponent />
    </ReBACAdminContext.Provider>,
  );
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: "Open" })),
  );
  expect(screen.getByText("panel state")).toBeInTheDocument();
});
