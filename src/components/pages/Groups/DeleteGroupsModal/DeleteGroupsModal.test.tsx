import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getDeleteGroupsItemMockHandler,
  getDeleteGroupsItemMockHandler400,
  getDeleteGroupsItemResponseMock400,
} from "api/groups/groups.msw";
import { DeleteEntityModalLabel } from "components/DeleteEntityModal";
import { renderComponent, hasToast } from "test/utils";

import DeleteGroupsModal from "./DeleteGroupsModal";
import { Label as DeleteGroupsModalLabel } from "./types";

const mockApiServer = setupServer(getDeleteGroupsItemMockHandler());

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("should delete groups", async () => {
  renderComponent(
    <DeleteGroupsModal groups={["group1", "group2"]} close={vi.fn()} />,
  );
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await userEvent.type(confirmationMessageTextBox, "delete 2 groups");
  await userEvent.click(screen.getByText(DeleteEntityModalLabel.DELETE));
  await hasToast(DeleteGroupsModalLabel.DEELTE_SUCCESS_MESSAGE, "positive");
});

test("should handle errors when deleting groups", async () => {
  mockApiServer.use(
    getDeleteGroupsItemMockHandler400(
      getDeleteGroupsItemResponseMock400({ message: "Can't delete group" }),
    ),
  );
  renderComponent(<DeleteGroupsModal groups={["group1"]} close={vi.fn()} />);
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await userEvent.type(confirmationMessageTextBox, "delete 1 group");
  await userEvent.click(screen.getByText(DeleteEntityModalLabel.DELETE));
  await hasToast(DeleteGroupsModalLabel.DELETE_ERROR_MESSAGE, "negative");
});