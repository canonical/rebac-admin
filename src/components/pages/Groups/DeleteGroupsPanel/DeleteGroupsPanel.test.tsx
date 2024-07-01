import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getDeleteGroupsItemMockHandler,
  getDeleteGroupsItemMockHandler400,
  getDeleteGroupsItemResponseMock400,
} from "api/groups/groups.msw";
import { DeleteEntityPanelLabel } from "components/DeleteEntityPanel";
import { renderComponent, hasToast } from "test/utils";

import DeleteGroupsPanel from "./DeleteGroupsPanel";
import { Label as DeleteGroupsPanelLabel } from "./types";

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
    <DeleteGroupsPanel groups={["group1", "group2"]} close={vi.fn()} />,
  );
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await userEvent.type(confirmationMessageTextBox, "remove 2 groups");
  await userEvent.click(screen.getByText(DeleteEntityPanelLabel.DELETE));
  await hasToast(DeleteGroupsPanelLabel.DEELTE_SUCCESS_MESSAGE, "positive");
});

test("should handle errors when deleting groups", async () => {
  mockApiServer.use(
    getDeleteGroupsItemMockHandler400(
      getDeleteGroupsItemResponseMock400({ message: "Can't remove group" }),
    ),
  );
  renderComponent(<DeleteGroupsPanel groups={["group1"]} close={vi.fn()} />);
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await userEvent.type(confirmationMessageTextBox, "remove 1 group");
  await userEvent.click(screen.getByText(DeleteEntityPanelLabel.DELETE));
  await hasToast(DeleteGroupsPanelLabel.DELETE_ERROR_MESSAGE, "negative");
});
