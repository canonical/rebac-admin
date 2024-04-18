import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReBACAdminContext } from "context/ReBACAdminContext";
import { renderComponent } from "test/utils";

import { usePanel } from "./usePanel";

const containerId = "portal-container";

const TestComponent = () => {
  const { generatePanel, openPanel, closePanel } = usePanel<{
    state?: string | null;
  }>((closePanel, data) => (
    <div data-testid="panel">
      <button onClick={closePanel}>Exit</button>
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
