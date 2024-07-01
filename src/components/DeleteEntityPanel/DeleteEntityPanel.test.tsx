import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import DeleteEntityPanel from "./DeleteEntityPanel";
import { Label } from "./types";

test("should render correctly for 1 entity", async () => {
  renderComponent(
    <DeleteEntityPanel
      entity="test"
      count={1}
      close={vi.fn()}
      onDelete={vi.fn()}
      isDeletePending={false}
    />,
  );
  expect(screen.getByText("Delete 1 test")).toBeInTheDocument();
  expect(
    screen.getByText("Are you sure you want to delete 1 test?", {
      exact: false,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "The deletion of tests is irreversible and might adversely affect your system.",
      { exact: false },
    ),
  ).toBeInTheDocument();
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  expect(screen.getByRole("button", { name: Label.DELETE })).toBeDisabled();
  expect(
    screen.getByRole("button", { name: Label.CANCEL }),
  ).toBeInTheDocument();
});

test("should render correctly for multiple entities", async () => {
  renderComponent(
    <DeleteEntityPanel
      entity="test"
      count={2}
      close={vi.fn()}
      onDelete={vi.fn()}
      isDeletePending={false}
    />,
  );
  expect(screen.getByText("Delete 2 tests")).toBeInTheDocument();
  expect(
    screen.getByText("Are you sure you want to delete 2 tests?", {
      exact: false,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "The deletion of tests is irreversible and might adversely affect your system.",
      { exact: false },
    ),
  ).toBeInTheDocument();
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  expect(screen.getByRole("button", { name: Label.DELETE })).toBeDisabled();
  expect(
    screen.getByRole("button", { name: Label.CANCEL }),
  ).toBeInTheDocument();
});

test("should enable the delete button when the confirmation message is correct", async () => {
  renderComponent(
    <DeleteEntityPanel
      entity="test"
      count={1}
      close={vi.fn()}
      onDelete={vi.fn()}
      isDeletePending={false}
    />,
  );
  expect(screen.getByRole("button", { name: Label.DELETE })).toBeDisabled();
  await userEvent.type(screen.getByRole("textbox"), "remove 1 test");
  expect(screen.getByRole("button", { name: Label.DELETE })).toBeEnabled();
});

test("should disable the delete button when the confirmation message is incorrect", async () => {
  renderComponent(
    <DeleteEntityPanel
      entity="test"
      count={2}
      close={vi.fn()}
      onDelete={vi.fn()}
      isDeletePending={false}
    />,
  );
  expect(screen.getByRole("button", { name: Label.DELETE })).toBeDisabled();
  await userEvent.type(screen.getByRole("textbox"), "remove 1 test");
  expect(screen.getByRole("button", { name: Label.DELETE })).toBeDisabled();
});

test("should handle delete when the delete button is clicked", async () => {
  const handleDelete = vi.fn();
  renderComponent(
    <DeleteEntityPanel
      entity="test"
      count={1}
      close={vi.fn()}
      onDelete={handleDelete}
      isDeletePending={false}
    />,
  );
  await userEvent.type(screen.getByRole("textbox"), "remove 1 test");
  await userEvent.click(screen.getByRole("button", { name: Label.DELETE }));
  expect(handleDelete).toHaveBeenCalledTimes(1);
});

test("should handle close when the cancel button is clicked", async () => {
  const handleClose = vi.fn();
  renderComponent(
    <DeleteEntityPanel
      entity="test"
      count={1}
      close={handleClose}
      onDelete={vi.fn()}
      isDeletePending={false}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: Label.CANCEL }));
  expect(handleClose).toHaveBeenCalledTimes(1);
});
