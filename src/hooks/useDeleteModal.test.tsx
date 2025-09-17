import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FC } from "react";

import { renderComponent } from "test/utils";

import { useDeleteModal } from "./useDeleteModal";

const TestComponent: FC = () => {
  const { generateModal, openModal, closeModal } = useDeleteModal<string[]>(
    (onClose, data) => (
      <div data-testid="modal">
        <button onClick={onClose}>Exit</button>
        {data}
      </div>
    ),
  );
  return (
    <>
      <button
        onClick={() => {
          openModal(["id1"]);
        }}
      >
        Open
      </button>
      <button
        onClick={() => {
          closeModal();
        }}
      >
        Close
      </button>
      {generateModal()}
    </>
  );
};

test("opens the modal", async () => {
  renderComponent(<TestComponent />);
  expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByTestId("modal")).toBeInTheDocument();
});

test("closes the modal", async () => {
  renderComponent(<TestComponent />);
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByTestId("modal")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
});

test("closes via the modal", async () => {
  renderComponent(<TestComponent />);
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByTestId("modal")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Exit" }));
  expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
});

test("displays data", async () => {
  renderComponent(<TestComponent />);
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByText("id1")).toBeInTheDocument();
});
