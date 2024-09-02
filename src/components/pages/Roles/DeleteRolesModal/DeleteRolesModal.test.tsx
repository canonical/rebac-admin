import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getDeleteRolesItemMockHandler,
  getDeleteRolesItemMockHandler400,
  getDeleteRolesItemResponseMock400,
} from "api/roles/roles.msw";
import { DeleteEntityModalLabel } from "components/DeleteEntityModal";
import { renderComponent } from "test/utils";

import DeleteRolesModal from "./DeleteRolesModal";
import { Label as DeleteRolesModalLabel } from "./types";

const mockApiServer = setupServer(getDeleteRolesItemMockHandler());

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("should delete roles", async () => {
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <DeleteRolesModal roles={["role1", "role2"]} close={vi.fn()} />,
  );
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await userEvent.type(confirmationMessageTextBox, "delete 2 roles");
  await userEvent.click(screen.getByText(DeleteEntityModalLabel.DELETE));
  expect(
    await findNotificationByText(DeleteRolesModalLabel.DEELTE_SUCCESS_MESSAGE, {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
});

test("should handle errors when deleting roles", async () => {
  mockApiServer.use(
    getDeleteRolesItemMockHandler400(
      getDeleteRolesItemResponseMock400({ message: "Can't delete role" }),
    ),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(<DeleteRolesModal roles={["role1"]} close={vi.fn()} />);
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await userEvent.type(confirmationMessageTextBox, "delete 1 role");
  await userEvent.click(screen.getByText(DeleteEntityModalLabel.DELETE));
  expect(
    await findNotificationByText(DeleteRolesModalLabel.DELETE_ERROR_MESSAGE, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});
