import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import {
  getDeleteIdentitiesItemMockHandler,
  getDeleteIdentitiesItemMockHandler400,
  getDeleteIdentitiesItemResponseMock400,
} from "api/identities/identities.msw";
import { DeleteEntityModalLabel } from "components/DeleteEntityModal";
import { renderComponent } from "test/utils";

import DeleteUsersModal from "./DeleteUsersModal";
import { Label as DeleteUsersModalLabel } from "./types";

const mockApiServer = setupServer(getDeleteIdentitiesItemMockHandler());

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

test("should delete identities", async () => {
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <DeleteUsersModal identities={["user1", "user2"]} close={vi.fn()} />,
  );
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await userEvent.type(confirmationMessageTextBox, "delete 2 users");
  await userEvent.click(screen.getByText(DeleteEntityModalLabel.DELETE));
  expect(
    await findNotificationByText(DeleteUsersModalLabel.DEELTE_SUCCESS_MESSAGE, {
      appearance: "toast",
      severity: "positive",
    }),
  ).toBeInTheDocument();
});

test("should handle errors when deleting identities", async () => {
  mockApiServer.use(
    getDeleteIdentitiesItemMockHandler400(
      getDeleteIdentitiesItemResponseMock400({ message: "Can't delete user" }),
    ),
  );
  const {
    result: { findNotificationByText },
  } = renderComponent(
    <DeleteUsersModal identities={["user1"]} close={vi.fn()} />,
  );
  const textBoxes = screen.getAllByRole("textbox");
  expect(textBoxes).toHaveLength(1);
  const confirmationMessageTextBox = textBoxes[0];
  await userEvent.type(confirmationMessageTextBox, "delete 1 user");
  await userEvent.click(screen.getByText(DeleteEntityModalLabel.DELETE));
  expect(
    await findNotificationByText(DeleteUsersModalLabel.DELETE_ERROR_MESSAGE, {
      appearance: "toast",
    }),
  ).toBeInTheDocument();
});
