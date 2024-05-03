import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getDeleteRolesIdMockHandler,
  getDeleteRolesIdMockHandler400,
  getDeleteRolesIdResponseMock400,
} from "api/roles-id/roles-id.msw";
import { Label as DeleteEntityPanelLabel } from "components/DeleteEntityPanel";
import { renderComponent, hasToast } from "test/utils";

import DeleteRolesPanel from "./DeleteRolesPanel";
import { Label as DeleteRolesPanelLabel } from "./types";

const mockApiServer = setupServer(getDeleteRolesIdMockHandler());

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
  renderComponent(
    <DeleteRolesPanel roles={["role1", "role2"]} close={vi.fn()} />,
  );
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await act(
    async () =>
      await userEvent.type(confirmationMessageTextBox, "remove 2 roles"),
  );
  await act(
    async () =>
      await userEvent.click(screen.getByText(DeleteEntityPanelLabel.DELETE)),
  );
  await hasToast(DeleteRolesPanelLabel.DEELTE_SUCCESS_MESSAGE, "positive");
});

test("should handle errors when deleting roles", async () => {
  mockApiServer.use(
    getDeleteRolesIdMockHandler400(
      getDeleteRolesIdResponseMock400({ message: "Can't remove role" }),
    ),
  );
  renderComponent(<DeleteRolesPanel roles={["role1"]} close={vi.fn()} />);
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await act(
    async () =>
      await userEvent.type(confirmationMessageTextBox, "remove 1 role"),
  );
  await act(
    async () =>
      await userEvent.click(screen.getByText(DeleteEntityPanelLabel.DELETE)),
  );
  await hasToast(DeleteRolesPanelLabel.DELETE_ERROR_MESSAGE, "negative");
});
